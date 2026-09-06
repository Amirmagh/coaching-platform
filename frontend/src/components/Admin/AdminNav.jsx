import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const MENU_ITEMS = [
  { to: '/admin', label: 'داشبورد', icon: '📊', end: true },
  { to: '/admin/users', label: 'کاربران', icon: '👥' },
  { to: '/admin/sessions', label: 'جلسات', icon: '💬' },
  { to: '/admin/payments', label: 'پرداخت‌ها', icon: '💳' },
  { to: '/admin/settings', label: 'تنظیمات', icon: '⚙️' },
];

const ROLE_LABELS = {
  admin: 'مدیر',
  moderator: 'ناظر',
  coach: 'کوچ',
  user: 'کاربر',
};

/**
 * Admin sidebar navigation: menu links, current admin profile with role
 * badge, and a logout action. Collapses to a top bar on small screens.
 */
export const AdminNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-gray-800 md:min-h-screen shadow-md md:sticky md:top-0 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">پنل مدیریت</h2>
      </div>

      <nav className="flex md:flex-col gap-1 p-2 overflow-x-auto">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {(user?.username || user?.email || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.username || user?.email || 'مدیر'}
            </p>
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
              {ROLE_LABELS[user?.role] || 'مدیر'}
            </span>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="btn-danger w-full text-sm">
          خروج
        </button>
      </div>
    </aside>
  );
};

AdminNav.propTypes = {};

export default AdminNav;
