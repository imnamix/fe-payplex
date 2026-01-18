import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../common/Spinner";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import {
  getAllProducts,
  getFeaturedProducts,
} from "../../services/productService";
import { ArrowUpRight } from "lucide-react";
import ProductModal from "./ProductModal";

const FeaturedProducts = ({ limit = 6 }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllProducts();
        // Handle the nested response structure
        const productsData = response.products || response.data || response;
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  const handleViewAll = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <button
            className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
            disabled
          >
            View All
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 mb-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 opacity-50 cursor-not-allowed">
            View All Products
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>

        <button
          className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
          onClick={handleViewAll}
        >
          View All
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 mb-8">
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
          </div>

          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}

          {/* View All Products Button */}
          <div className="flex justify-center">
            <button
              onClick={handleViewAll}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View All Products
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedProducts;
