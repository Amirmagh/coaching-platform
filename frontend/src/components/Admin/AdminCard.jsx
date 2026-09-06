import React from 'react';
import PropTypes from 'prop-types';

const COLOR_VARIANTS = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  red: 'text-red-600 dark:text-red-400',
  amber: 'text-amber-600 dark:text-amber-400',
  teal: 'text-teal-600 dark:text-teal-400',
};

/**
 * Admin metric card: shows a value/label with an icon, an optional trend
 * indicator (up/down percentage), and a color variant.
 */
export const AdminCard = ({ label, value, icon, trend, variant = 'blue' }) => {
  const colorClass = COLOR_VARIANTS[variant] || COLOR_VARIANTS.blue;
  const trendUp = typeof trend === 'number' && trend >= 0;

  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {icon && <span className={`text-3xl ${colorClass}`}>{icon}</span>}
        <div>
          <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
      {typeof trend === 'number' && (
        <span
          className={`text-sm font-medium ${
            trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {trendUp ? '▲' : '▼'} {Math.abs(trend)}٪
        </span>
      )}
    </div>
  );
};

AdminCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  trend: PropTypes.number,
  variant: PropTypes.oneOf(['blue', 'green', 'red', 'amber', 'teal']),
};

export default AdminCard;
