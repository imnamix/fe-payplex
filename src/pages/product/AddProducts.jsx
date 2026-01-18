import React, { useState } from "react";
import InputField from "../../components/common/InputField";
import Spinner from "../../components/common/Spinner";
import ImagePreviewModal from "../../components/common/ImagePreviewModal";
import Skeleton from "../../components/common/Skeleton";
import toast from "react-hot-toast";
import { X, Upload, ChevronDown } from "lucide-react";
import { uploadProductImages, createProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingIndices, setUploadingIndices] = useState(new Set());
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Sports",
    "Books",
    "Toys",
    "Beauty",
    "Other",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim())
      newErrors.productName = "Product name is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.quantity || parseInt(formData.quantity) <= 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const maxImages = 5 - formData.images.length;
    if (files.length > maxImages) {
      toast.error(`You can add maximum ${maxImages} more images`);
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const invalidFiles = [];
    const validFiles = [];

    files.forEach((file) => {
      // Validate file type
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} - Invalid file type`);
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} - File size exceeds 5MB`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      invalidFiles.forEach((msg) => toast.error(msg));
    }

    if (validFiles.length > 0) {
      setIsUploadingImages(true);
      const uploadingToast = toast.loading("Uploading images...");

      // Track indices BEFORE adding previews
      const startIndex = imagePreviews.length;
      const uploadingIndicesForThisBatch = new Set();
      
      // Create previews first and add to state immediately with skeleton
      const newPreviews = [];
      let loadedCount = 0;

      validFiles.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          loadedCount++;
          if (loadedCount === validFiles.length) {
            // Add all previews to state
            setImagePreviews((prev) => [...prev, ...newPreviews]);
            
            // Add indices to tracking set
            for (let i = 0; i < validFiles.length; i++) {
              uploadingIndicesForThisBatch.add(startIndex + i);
            }
            
            // Update uploading indices
            setUploadingIndices((prev) => {
              const newSet = new Set(prev);
              uploadingIndicesForThisBatch.forEach((idx) => {
                newSet.add(idx);
              });
              return newSet;
            });
          }
        };
        reader.readAsDataURL(file);
      });

      try {
        // Call upload API immediately
        const uploadResponse = await uploadProductImages(validFiles);
        const uploadedImages = uploadResponse.images;

        if (!uploadedImages || uploadedImages.length === 0) {
          toast.error("Failed to upload images", { id: uploadingToast });
          setIsUploadingImages(false);
          setUploadingIndices((prev) => {
            const newSet = new Set(prev);
            uploadingIndicesForThisBatch.forEach((idx) => {
              newSet.delete(idx);
            });
            return newSet;
          });
          return;
        }

        // Wait a bit for previews to render, then update form data and remove from uploading set
        setTimeout(() => {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...uploadedImages],
          }));

          if (errors.images) {
            setErrors((prev) => ({
              ...prev,
              images: "",
            }));
          }

          // Remove uploaded indices from uploading set
          setUploadingIndices((prev) => {
            const newSet = new Set(prev);
            uploadingIndicesForThisBatch.forEach((idx) => {
              newSet.delete(idx);
            });
            return newSet;
          });

          toast.success(`${uploadedImages.length} image(s) uploaded successfully`, { id: uploadingToast });
          setIsUploadingImages(false);
        }, 100);
      } catch (error) {
        toast.error(error?.message || "Failed to upload images", { id: uploadingToast });
        setIsUploadingImages(false);
        setUploadingIndices((prev) => {
          const newSet = new Set(prev);
          uploadingIndicesForThisBatch.forEach((idx) => {
            newSet.delete(idx);
          });
          return newSet;
        });
        console.error("Image upload error:", error);
      }
    }
  };

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Update uploading indices
    const newUploadingIndices = new Set(uploadingIndices);
    newUploadingIndices.delete(index);
    // Shift indices greater than removed index
    const shifted = new Set();
    newUploadingIndices.forEach((idx) => {
      shifted.add(idx > index ? idx - 1 : idx);
    });
    setUploadingIndices(shifted);
  };

  const handleViewImage = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create product with already uploaded images
      const productData = {
        productName: formData.productName,
        price: formData.price,
        quantity: formData.quantity,
        category: formData.category,
        description: formData.description,
        images: formData.images, // Images already uploaded
      };

      const submitToast = toast.loading("Creating product...");
      await createProduct(productData);
      toast.dismiss(submitToast);

      toast.success("Product added successfully!");
      navigate(-1)

      // Reset form
      setFormData({
        productName: "",
        price: "",
        quantity: "",
        category: "",
        description: "",
        images: [],
      });
      setImagePreviews([]);
      setErrors({});
    } catch (error) {
      const errorMessage = error?.message || "Failed to add product";
      toast.error(errorMessage);
      console.error("Product submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Product</h1>
          <p className="text-gray-600">Fill in the product details below</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <InputField
              id="productName"
              name="productName"
              label="Product Name"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={handleChange}
              error={errors.productName}
            />

            {/* Price, Quantity and Category Row */}
            <div className="grid grid-cols-3 gap-4">
              <InputField
                id="price"
                name="price"
                label="Price (₹)"
                type="number"
                placeholder="999.99"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                className="mb-0"
              />

              <InputField
                id="quantity"
                name="quantity"
                label="Quantity"
                type="number"
                placeholder="10"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
                className="mb-0"
              />

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Category
                </label>

                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`
        w-full px-4 py-3 pr-10 rounded-lg border-2
        appearance-none
        ${
          errors.category
            ? "border-red-500 bg-red-50"
            : "border-gray-300 focus:border-blue-500 bg-white"
        }
        focus:outline-none focus:ring-2 focus:ring-blue-300
        transition-all duration-200
      `}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {/* Lucide Dropdown Icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronDown
                      className={`h-5 w-5 ${
                        errors.category ? "text-red-500" : "text-gray-500"
                      }`}
                    />
                  </div>
                </div>

                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-300
                  transition-all duration-200
                  resize-none
                  ${errors.description ? "bg-red-50" : "bg-white"}
                `}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Product Images (Max 5)
              </label>
              <p className="text-gray-500 text-sm mb-3">
                {formData.images.length}/5 images uploaded
              </p>

              {formData.images.length < 5 && (
                <div className="mb-4">
                  <label
                    htmlFor="imageInput"
                    className={`
                      flex flex-col items-center justify-center w-full p-6
                      border-2 border-dashed rounded-lg cursor-pointer
                      ${
                        errors.images
                          ? "border-red-500 bg-red-50"
                          : "border-blue-300 bg-blue-50 hover:bg-blue-100"
                      }
                      transition-all duration-200
                    `}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-10 h-10 text-blue-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">
                        Click to upload images
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      id="imageInput"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    //   disabled={isUploadingImages}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {errors.images && (
                <p className="text-red-600 text-sm mb-3">{errors.images}</p>
              )}

              {/* Image Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      {uploadingIndices.has(index) ? (
                        <Skeleton className="w-full h-24 rounded-lg" />
                      ) : (
                        <>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            onClick={() => handleViewImage(index)}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 px-4 rounded-lg font-medium text-white
                ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
                shadow-md transition-colors duration-200
              `}
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImageIndex !== null && (
        <ImagePreviewModal
          isOpen={isModalOpen}
          image={imagePreviews[selectedImageIndex]}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AddProducts;
