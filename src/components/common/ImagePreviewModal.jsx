// components/common/ImagePreviewModal.jsx
import React from "react";

const ImagePreviewModal = ({ isOpen, image, onClose }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose} // click outside closes modal
    >
      {/* Modal content */}
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-4"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <img
          src={image}
          alt="Preview"
          className="w-full max-h-[70vh] object-contain rounded-lg p-4"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
