import React from "react";

const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`bg-gray-300 animate-pulse ${className}`}
      style={{
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    />
  );
};

export default Skeleton;
