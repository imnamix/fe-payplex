import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Payplex
        </h1>
        {/* Logo / App Name */}

        {/* 404 */}
        <h2 className="text-8xl font-black text-gray-800 mb-4">404</h2>

        {/* Message */}
        <p className="text-gray-600 text-lg mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition-all"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
