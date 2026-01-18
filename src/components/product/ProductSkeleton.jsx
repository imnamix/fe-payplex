import React from "react";
import Skeleton from "../common/Skeleton";

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full animate-pulse">
      {/* IMAGE SKELETON */}
      <div className="relative h-50 w-full bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>

      {/* CONTENT SKELETON */}
      <div className="p-3 flex flex-col flex-1 space-y-3">
        {/* CATEGORY & RATING */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>

        {/* PRODUCT NAME */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>

        {/* PRICE */}
        <div className="mt-auto pt-2">
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
