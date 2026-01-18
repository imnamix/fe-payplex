import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const ProductDetailModal = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (product.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const currentImage = product.images?.[currentImageIndex];

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4 ">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={currentImage?.url}
                  alt={product.productName}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400?text=No+Image";
                  }}
                />
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`${product.productName} ${index + 1}`}
                      className={`w-16 h-16 rounded object-cover cursor-pointer transition-all ${
                        currentImageIndex === index
                          ? "ring-2 ring-blue-600"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/50?text=No+Image";
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {product.productName}
              </h3>

              {/* Category and Rating */}
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-semibold text-gray-900">
                    {product.rating ? product.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-600 text-sm mb-2">Price</p>
                <p className="text-4xl font-bold text-gray-900">
                  ₹{product.price?.toFixed(2) || "0.00"}
                </p>
              </div>

              {/* Quantity */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-600 text-sm mb-2">Available Quantity</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.quantity}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      product.quantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-600 text-sm mb-2">Seller</p>
                <p className="text-lg font-semibold text-gray-900">
                  {product.seller?.name || "Unknown Seller"}
                </p>
                {product.seller?.email && (
                  <p className="text-gray-600 text-sm mt-1">
                    {product.seller.email}
                  </p>
                )}
                {product.seller?.contactNumber && (
                  <p className="text-gray-600 text-sm">
                    {product.seller.contactNumber}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600 text-sm mb-2">Description</p>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Status */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                    product.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status || "active"}
                </span>
              </div>

              {/* Date Info */}
              <div className="mt-6 text-xs text-gray-500 space-y-1">
                <p>
                  Created:{" "}
                  {new Date(product.createdAt).toLocaleDateString("en-IN")}
                </p>
                {product.updatedAt && (
                  <p>
                    Updated:{" "}
                    {new Date(product.updatedAt).toLocaleDateString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
