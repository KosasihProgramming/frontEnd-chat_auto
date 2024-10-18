import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("email");
    window.location.href = "/";
  };
  return (
    <nav className="bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-indigo-600">Chat CS AI</div>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {/* Ganti 'a' dengan 'Link' */}
                <Link
                  to="/"
                  className="hover:bg-indigo-100 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="hover:bg-indigo-100 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>

                {/* Menu with dropdown */}
                <div className="relative group">
                  <button className="hover:bg-indigo-100 duration-300 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    Conversations
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 transform scale-95">
                    <Link
                      to="/conversation"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 transition-colors"
                    >
                      Conversation List
                    </Link>
                    <Link
                      to="/services/mobile-apps"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 transition-colors"
                    >
                      Chat Playground
                    </Link>
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="hover:bg-indigo-100 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:bg-indigo-100 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
