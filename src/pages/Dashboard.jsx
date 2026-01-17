import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingCart, Package, CheckCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import StatCard from "../components/common/StatCard";
import ProductCard from "../components/product/ProductCard";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cartProducts: 0,
    orderedProducts: 0,
    addedProducts: 0,
  });

  // Fetch products from dummy API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://fakestoreapi.com/products?limit=20",
        );
        const data = await response.json();
        setProducts(data);

        // Set dummy stats
        setStats({
          cartProducts: Math.floor(Math.random() * 10) + 1,
          orderedProducts: Math.floor(Math.random() * 20) + 1,
          addedProducts: Math.floor(Math.random() * 15) + 1,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewAll = () => {
    navigate("/products");
  };

  const handleAddProducts = () => {
    navigate("/add-product");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Hello,{" "}
              <span className="text-blue-600">{user?.name || "User"}</span>!
            </h1>
            <p className="text-gray-600">Welcome to your dashboard</p>
          </div>
          <button
            onClick={handleAddProducts}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Add Products
          </button>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Cart Products"
            tagline="Waiting for checkout"
            count={stats.cartProducts}
            icon={ShoppingCart}
            bgColor="bg-blue-50"
          />

          <StatCard
            title="Ordered Products"
            tagline="Successfully purchased"
            count={stats.orderedProducts}
            icon={Package}
            bgColor="bg-green-50"
          />

          <StatCard
            title="Added Products"
            tagline="Your added items"
            count={stats.addedProducts}
            icon={CheckCircle}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product.title,
                      description: product.description,
                      price: product.price,
                      image: product.image,
                    }}
                    onViewAll={handleViewAll}
                  />
                ))}
              </div>

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
      </div>
    </div>
  );
};

export default Dashboard;
