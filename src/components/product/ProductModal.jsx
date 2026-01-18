import { X, Star, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../services/cartService";
import { addToCartStart, addToCartSuccess, addToCartError } from "../../store/slices/cartSlice";

const ProductModal = ({ product, onClose }) => {
    console.log('ProductModal rendered with product:', product);
  const fallbackImage =
    "https://img.freepik.com/premium-vector/image-available-icon_268104-3618.jpg?semt=ais_hybrid&w=740&q=80";
  const images = product.image || [];
  const maxQty = product.quantity || 1;

  const [activeImage, setActiveImage] = useState(images[0]?.url);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { loading: cartLoading } = useSelector((state) => state.cart);

  const increaseQty = () => {
    if (qty >= maxQty) {
      setError(`Currently only ${maxQty} quantity available`);
      return;
    }
    setError("");
    setQty(qty + 1);
  };

  const decreaseQty = () => {
    setError("");
    if (qty > 1) setQty(qty - 1);
  };

  const handleAddToCart = async () => {
    try {
      setError("");
      setSuccess("");
      setIsLoading(true);

      dispatch(addToCartStart());
      const response = await addToCart(product.id, qty);

      dispatch(addToCartSuccess({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: qty,
        image: product.image?.[0]?.url,
      }));

      setSuccess("Product added to cart!");
    //   setTimeout(() => {
    //     onClose();
    //   }, 1000);
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : err.message || "Failed to add product to cart";
      setError(errorMsg);
      dispatch(addToCartError(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  // random discount (runs once per modal open)
  const hasDiscount = Math.random() < 0.5; // 50% chance
  const discountPercent = hasDiscount
    ? [5, 10, 15, 20, 25, 30][Math.floor(Math.random() * 6)]
    : 0;

  const originalPrice = hasDiscount
    ? Math.round(product.price / (1 - discountPercent / 100))
    : product.price;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose} // 👈 close on outside click
    >
      <div
        className="bg-slate-900 text-white w-full max-w-5xl rounded-2xl p-4 sm:p-6 md:p-12 relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 my-8"
        onClick={(e) => e.stopPropagation()} // 👈 prevent closing when clicking inside
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-300 hover:text-white transition"
        >
          <X size={24} className="sm:w-6 sm:h-6" />
        </button>

        {/* LEFT: IMAGE + THUMBNAILS */}
        <div className="mt-8 sm:mt-0">
          <div className="bg-white rounded-xl flex items-center justify-center p-3 mb-4 h-48 sm:h-60 md:h-80">
            <img
              src={activeImage || fallbackImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage;
              }}
            />
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 justify-center overflow-x-auto pb-2">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={`border rounded-lg p-1 bg-white transition flex-shrink-0
                    ${
                      activeImage === img.url
                        ? "border-teal-400"
                        : "border-gray-300 hover:border-teal-300"
                    }`}
                >
                  <img
                    src={img.url || fallbackImage}
                    alt="thumb"
                    className="h-12 sm:h-14 w-12 sm:w-14 object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">{product.title}</h2>
            <span className="shrink-0 bg-blue-500 text-black text-xs px-3 py-1 rounded-full w-fit">
              In Stock
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 mb-3">
            Category: {product.category}
          </p>

          {/* RATING */}
          <div className="flex flex-wrap items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  i < Math.round(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-500"
                }`}
              />
            ))}
            <span className="text-xs sm:text-sm text-gray-300 ml-1 sm:ml-2">
              {product.rating} ({product.ratingCount} reviews)
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-xs sm:text-sm text-gray-200 mb-5 line-clamp-3">
            {product.description}
          </p>

          {/* PRICE */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
            <span className="text-2xl sm:text-3xl font-bold text-blue-400">
              ₹{product.price}
            </span>

            {hasDiscount && (
              <>
                <span className="line-through text-gray-400 text-sm sm:text-base">
                  ₹{originalPrice}
                </span>

                <span className="bg-red-100 text-red-600 text-xs px-2 sm:px-3 py-1 rounded-full">
                  {discountPercent}% Off
                </span>
              </>
            )}
          </div>

          {/* QUANTITY */}
          <div className="mb-5">
            <p className="text-sm text-gray-300 mb-2">Quantity</p>
            <div className="flex items-center gap-3 sm:gap-4 border border-gray-700 w-max rounded-sm">
              <button
                onClick={decreaseQty}
                className="p-2 bg-slate-700 hover:bg-slate-600 transition"
              >
                <Minus size={16} className="sm:w-5 sm:h-5" />
              </button>

              <span className="text-base sm:text-lg font-semibold w-4 text-center">
                {qty}
              </span>

              <button
                onClick={increaseQty}
                className="p-2 bg-slate-700 hover:bg-slate-600 transition"
              >
                <Plus size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs sm:text-sm mt-2">{error}</p>
            )}
          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <p className="text-green-400 text-xs sm:text-sm mb-3 text-center">{success}</p>
          )}

          {/* ACTION */}
          <button
            onClick={handleAddToCart}
            disabled={isLoading || cartLoading}
            className="mt-auto bg-blue-500 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-2 sm:py-3 rounded-xl transition w-full"
          >
            {isLoading || cartLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
