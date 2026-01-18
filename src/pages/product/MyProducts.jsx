import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, Edit, Trash2, Eye, Filter } from "lucide-react";
import { getUserProducts, deleteProduct } from "../../services/productService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

const CATEGORIES = [
  "All",
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

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch user's products
  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await getUserProducts(1, 1000);
      if (response.success || response.products) {
        const allProducts = response.products || response.data || [];
        setProducts(allProducts);
        filterProducts(allProducts, searchQuery, selectedCategory);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and category
  const filterProducts = (prods, search, category) => {
    let filtered = prods;

    // Category filter
    if (category !== "All") {
      filtered = filtered.filter(
        (product) => product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.productName?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // Initial fetch
  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Handle search change
  useEffect(() => {
    filterProducts(products, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, products]);

  // Handle delete
  const handleDelete = async (productId) => {
    try {
      const response = await deleteProduct(productId);
      if (response.success || response.message) {
        toast.success("Product deleted successfully");
        setProducts(products.filter((p) => p._id !== productId));
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Products</h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products by name, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        )}

        {/* Products Table */}
        {!loading && filteredProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {/* Product Image */}
                      <td className="px-4 py-4">
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.productName}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/50?text=No+Image";
                          }}
                        />
                      </td>

                      {/* Product Name */}
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                        {product.productName}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        ₹{product.price?.toFixed(2) || "0.00"}
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.quantity > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status || "active"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => navigate(`/edit-product/${product._id}`)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmId(product._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">
              {products.length === 0
                ? "You haven't added any products yet"
                : "No products match your filters"}
            </p>
            {products.length === 0 && (
              <button
                onClick={() => navigate("/add-product")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add Your First Product
              </button>
            )}
            {products.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Product?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
