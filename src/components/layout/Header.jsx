import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, ShoppingBag, LogOut } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  // 🔑 Replace this with real auth state
  const isLoggedIn = true;

  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setOpenMenu((prev) => !prev);
    }
  };

  const handleLogout = () => {
    setOpenMenu(false);
    // TODO: clear auth state / tokens
    navigate("/login");
  };

  // ✅ Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Payplex
          </h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-5 relative" ref={menuRef}>
          {/* Search */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm ml-2 w-40"
            />
          </div>

          {/* Cart */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-6 w-6 text-gray-700" />
          </button>

          {/* User */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={handleUserClick}
          >
            <User className="h-6 w-6 text-gray-700" />
          </button>

          {/* User Dropdown */}
          {isLoggedIn && openMenu && (
            <div className="absolute right-0 top-12 w-44 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <User size={16} />
                My Profile
              </button>

              <button
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/orders");
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <ShoppingBag size={16} />
                Orders
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
