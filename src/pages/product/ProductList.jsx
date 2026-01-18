import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import ProductSkeleton from "../../components/product/ProductSkeleton";
import ProductModal from "../../components/product/ProductModal";
import { getAllProducts } from "../../services/productService";
import { Loader2, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_DELAY = 500; // milliseconds

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
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
];

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);
  const searchInputRef = useRef(null);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_DELAY);

  // Fetch products
  const fetchProducts = useCallback(
    async (pageNum, category, search, reset = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllProducts(
          pageNum,
          ITEMS_PER_PAGE,
          category === "All" ? "" : category,
          search,
        );

        const newProducts = response.products || response.data || [];
        const pagination = response.pagination || {};

        if (reset) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }

        // Check if there are more products to fetch
        const hasMorePages =
          pagination.page < pagination.pages ||
          (pagination.pages === 0 && pageNum === 1);
        setHasMore(hasMorePages);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial fetch
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, selectedCategory, debouncedSearchQuery, true);
  }, [selectedCategory, debouncedSearchQuery, fetchProducts]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          products.length > 0
        ) {
          setPage((prev) => prev + 1);
          fetchProducts(page + 1, selectedCategory, debouncedSearchQuery);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [
    hasMore,
    loading,
    page,
    selectedCategory,
    debouncedSearchQuery,
    fetchProducts,
    products.length,
  ]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    setProducts([]);
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(1);
    setProducts([]);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
    setProducts([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-1 py-1">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 my-1">
            Browse our wide selection of products
          </p>

          {/* Search Bar */}
          <div className="relative w-max">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="
      w-[380px]
      pl-10 pr-10 py-2.5
      text-sm
      border border-gray-300
      rounded-md
      bg-white
      shadow-sm
      transition
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500/30
      focus:border-blue-500
      hover:border-gray-400
    "
            />

            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="
        absolute right-3 top-1/2 -translate-y-1/2
        text-gray-400
        hover:text-gray-600
        transition
      "
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="top-16 z-30">
        <div className="max-w-7xl mx-auto px-1 py-4">
          <div className="relative">
            <div
              id="categories-container"
              className="flex gap-3 overflow-x-auto scroll-smooth hide-scrollbar"
              style={{ scrollBehavior: "smooth" }}
            >
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition flex-shrink-0 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-1 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 && !loading ? (
          <div className="text-center py-10">
            <img
              src="https://abhyudayorganic.com/frontend-assets/images/product-not-found.png"
              alt="No Products"
              className="w-48 h-48 mx-auto mb-4 object-contain"
            />
            <h1 className="font-bold text-lg text-gray-600">
              {searchQuery
                ? `No products found for "${searchQuery}"`
                : "No products available in this category"}
            </h1>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    title: product.productName,
                    description: product.description,
                    category: product.category,
                    price: product.price,
                    image: product.images || [],
                    rating: product.ratings?.average,
                    ratingCount: product.ratings?.count,
                  }}
                  onClick={setSelectedProduct}
                />
              ))}

              {/* Skeleton Loaders during loading */}
              {loading &&
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <ProductSkeleton key={`skeleton-${index}`} />
                ))}
            </div>

            {/* Infinite Scroll Observer */}
            <div ref={observerTarget} className="flex justify-center py-8 mt-8">
              {hasMore && products.length > 0 && (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  <p className="text-gray-600 mt-2">Loading more products...</p>
                </div>
              )}
            </div>

            {/* End of List Message */}
            {/* {!hasMore && products.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No more products to load</p>
              </div>
            )} */}
          </>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
