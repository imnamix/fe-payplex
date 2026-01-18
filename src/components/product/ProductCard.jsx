import React from "react";
import { Star } from "lucide-react";

const ProductCard = ({ product, onClick }) => {
  const formattedPrice = Number(product.price).toFixed(2);

  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col h-full"
    >
      {/* IMAGE */}
      <div className="relative h-50 w-full overflow-hidden">
        <img
          src={
            product.image?.[0]?.url ||
            "https://img.freepik.com/premium-vector/image-available-icon_268104-3618.jpg?semt=ais_hybrid&w=740&q=80"
          }
          alt={product.title}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src =
              "https://img.freepik.com/premium-vector/image-available-icon_268104-3618.jpg?semt=ais_hybrid&w=740&q=80";
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col flex-1">
        {/* CATEGORY & RATING */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="uppercase tracking-wide">{product.category}</span>

          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-700 font-medium">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* PRODUCT NAME (fixed height) */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* PRICE (always bottom) */}
        <p className="text-base font-bold text-gray-900 mt-auto">
          ₹{formattedPrice}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
