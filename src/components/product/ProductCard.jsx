import React from 'react';
import { Eye } from 'lucide-react';

const ProductCard = ({ product, onViewAll }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=Product'}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
          ${product.price}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-2">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 flex-grow mb-4">
          {product.description}
        </p>

        {/* View All Button */}
        <button
          onClick={onViewAll}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <Eye size={18} />
          View All
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
