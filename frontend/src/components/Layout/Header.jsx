import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            GROW
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            سیستم کوچینگ
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {user ? (
            <>
              <Link to="/coaching" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition">
                کوچینگ
              </Link>
              <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition">
                داشبورد
              </Link>
              <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition">
                پروفایل
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition">
                ورود
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                ثبت نام
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 px-4 py-4 space-y-3">
          {user ? (
            <>
              <Link to="/coaching" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
                کوچینگ
              </Link>
              <Link to="/dashboard" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
                داشبورد
              </Link>
              <Link to="/profile" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
                پروفایل
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
                ورود
              </Link>
              <Link to="/signup" className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center">
                ثبت نام
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
