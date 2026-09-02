import React from 'react';
import PropTypes from 'prop-types';

/**
 * Visual progress indicator (0-100%). RTL-aware and dark-mode ready.
 */
export const ProgressBar = ({ value = 0, label, colorClass = 'bg-blue-600' }) => {
  const percent = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  colorClass: PropTypes.string,
};

export default ProgressBar;
