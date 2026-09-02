import React from 'react';
import PropTypes from 'prop-types';

/**
 * Small dashboard stat card (e.g. "Sessions completed", "Goals achieved").
 */
export const StatCard = ({ label, value, icon, colorClass = 'text-blue-600 dark:text-blue-400' }) => (
  <div className="card flex items-center gap-4">
    {icon && <span className={`text-3xl ${colorClass}`}>{icon}</span>}
    <div>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  colorClass: PropTypes.string,
};

export default StatCard;
