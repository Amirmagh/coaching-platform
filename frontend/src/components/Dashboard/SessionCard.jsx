import React from 'react';
import PropTypes from 'prop-types';
import { formatDateTime } from '../../utils/formatters';
import { SESSION_STATUS } from '../../utils/constants';

const STATUS_LABELS = {
  [SESSION_STATUS.SCHEDULED]: 'برنامه‌ریزی شده',
  [SESSION_STATUS.IN_PROGRESS]: 'در حال انجام',
  [SESSION_STATUS.COMPLETED]: 'تکمیل شده',
  [SESSION_STATUS.CANCELLED]: 'لغو شده',
};

const STATUS_COLORS = {
  [SESSION_STATUS.SCHEDULED]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
  [SESSION_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  [SESSION_STATUS.COMPLETED]: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  [SESSION_STATUS.CANCELLED]: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

/**
 * Reusable card summarizing a single coaching session.
 */
export const SessionCard = ({ session, onClick }) => {
  const { title, goal_title, created_at, status } = session;

  return (
    <div
      className="card-interactive animate-fadeIn"
      onClick={() => onClick && onClick(session)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 dark:text-white">{title || 'جلسه کوچینگ'}</h3>
        {status && (
          <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[status] || ''}`}>
            {STATUS_LABELS[status] || status}
          </span>
        )}
      </div>
      {goal_title && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">هدف: {goal_title}</p>
      )}
      {created_at && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(created_at)}</p>
      )}
    </div>
  );
};

SessionCard.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    goal_title: PropTypes.string,
    created_at: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default SessionCard;
