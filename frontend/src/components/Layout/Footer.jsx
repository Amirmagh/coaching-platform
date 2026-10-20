import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Site-wide footer with quick links, kept RTL/Farsi and dark-mode aware.
 */
export const Footer = () => (
  <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">سیستم کوچینگ GROW</h4>
        <p className="text-gray-500 dark:text-gray-400">
          پلتفرم کوچینگ هوشمند مبتنی بر مدل GROW برای رشد فردی و حرفه‌ای.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">لینک‌های سریع</h4>
        <ul className="space-y-1">
          <li>
            <Link to="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
              داشبورد
            </Link>
          </li>
          <li>
            <Link to="/sessions" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
              تاریخچه جلسات
            </Link>
          </li>
          <li>
            <Link to="/profile" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
              پروفایل
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">پشتیبانی</h4>
        <p className="text-gray-500 dark:text-gray-400">support@coaching-platform.example</p>
      </div>
    </div>
    <div className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
      © {new Date().getFullYear()} سیستم کوچینگ GROW. تمامی حقوق محفوظ است.
    </div>
  </footer>
);

export default Footer;
