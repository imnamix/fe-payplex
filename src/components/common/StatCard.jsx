import React from 'react';

const StatCard = ({ title, tagline, count, icon: Icon, bgColor }) => {
  return (
    <div
      className={`${bgColor} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300`}
    >
      <p className="text-gray-700 text-sm font-medium mb-4">{title}</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold text-gray-900">{count}</p>
          {tagline && (
            <p className="text-gray-500 text-xs mt-1">{tagline}</p>
          )}
        </div>

        {Icon && (
          <Icon size={48} className="text-blue-600 opacity-20" />
        )}
      </div>
    </div>
  );
};

export default StatCard;
