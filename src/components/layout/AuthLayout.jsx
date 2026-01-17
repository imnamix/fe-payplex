import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Auth Content - Centered */}
      <div className="flex-1 flex items-center justify-center w-full px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
