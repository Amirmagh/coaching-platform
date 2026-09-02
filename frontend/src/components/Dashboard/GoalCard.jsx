import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from '../Common/ProgressBar';
import { formatDate, formatProgress } from '../../utils/formatters';

/**
 * Reusable card showing a single goal with its progress.
 */
export const GoalCard = ({ goal, onClick }) => {
  const { title, description, current_value, target_value, deadline, status } = goal;
  const percent = formatProgress(current_value, target_value);

  return (
    <div
      className="card-interactive animate-fadeIn"
      onClick={() => onClick && onClick(goal)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
        {status && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
            {status}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{description}</p>
      )}
      <ProgressBar value={percent} label="پیشرفت" />
      {deadline && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          مهلت: {formatDate(deadline)}
        </p>
      )}
    </div>
  );
};

GoalCard.propTypes = {
  goal: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    current_value: PropTypes.number,
    target_value: PropTypes.number,
    deadline: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default GoalCard;
