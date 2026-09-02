import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Landing page for anonymous and returning visitors.
 */
export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fadeIn">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        سیستم کوچینگ GROW
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        پلتفرم کوچینگ هوشمند مبتنی بر مدل GROW برای رشد فردی و حرفه‌ای شما.
      </p>
      <Link to={user ? '/dashboard' : '/signup'} className="btn-primary">
        {user ? 'رفتن به داشبورد' : 'شروع کنید'}
      </Link>
    </div>
  );
};

export default HomePage;
