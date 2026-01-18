import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { updateProduct, uploadProductImages } from "../../services/productService";
import toast from "react-hot-toast";
import InputField from "../common/InputField";

const CATEGORIES = [
  "Electronics",
  "Jewelery",
  "Fashion",
  "Home & Kitchen",
  "Accessories",
  "Sports",
  "Toys",
  "Beauty",
  "Clothing",
  "Books",
  "Other",
];

const ProductEditModal = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    productName: product.productName || "",
    description: product.description || "",
    price: product.price || "",
    quantity: product.quantity || "",
    category: product.category || "",
  });

  const [images, setImages] = useState(product.images || []);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUploadingImages, setIsUploadingImages] = useState(false);

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

    const maxNewImages = 5 - images.length - newImages.length;
    if (files.length > maxNewImages) {
      toast.error(`You can add maximum ${maxNewImages} more images`);
      return;
    }

    // Create previews
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages([...newImages, ...files]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeExistingImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const newPrev = [...prev];
      URL.revokeObjectURL(newPrev[index].preview);
      return newPrev.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim())
      newErrors.productName = "Product name is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.quantity || parseInt(formData.quantity) < 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (images.length + newImages.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      let finalImages = [...images];

      // Upload new images if any
      if (newImages.length > 0) {
        setIsUploadingImages(true);
        const uploadResponse = await uploadProductImages(newImages);

        if (uploadResponse.success || uploadResponse.images) {
          finalImages = [...finalImages, ...(uploadResponse.images || [])];
        }
        setIsUploadingImages(false);
      }

      // Update product
      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        images: finalImages,
      };

      const response = await updateProduct(product._id, updateData);

      if (response.success || response.product) {
        toast.success("Product updated successfully");
        onUpdate(response.product || response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <InputField
            label="Product Name"
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            error={errors.productName}
            placeholder="Enter product name"
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Price */}
          <InputField
            label="Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            placeholder="Enter price"
            step="0.01"
            min="0"
          />

          {/* Quantity */}
          <InputField
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
            placeholder="Enter quantity"
            min="0"
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Existing Images */}
          {images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-2">
                {images.length} image{images.length !== 1 ? "s" : ""} - Max 5 total
              </p>
            </div>
          )}

          {/* Image Upload */}
          {images.length < 5 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Images (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploadingImages}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-gray-700 font-medium">
                    Click to upload images
                  </p>
                  <p className="text-gray-500 text-sm">
                    You can add up to {5 - images.length} more image
                    {5 - images.length !== 1 ? "s" : ""}
                  </p>
                </label>
              </div>

              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    New Images to Upload
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {errors.images && (
            <p className="text-red-600 text-sm">{errors.images}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImages}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting || isUploadingImages ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
