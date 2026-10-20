import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const TYPE_STYLES = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-amber-500',
};

/**
 * Lightweight toast notification. Auto-dismisses after `duration` ms and can
 * also be closed manually. Rendered fixed at the bottom of the viewport.
 */
export const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className={`fixed bottom-4 right-4 z-[60] text-white px-4 py-3 rounded-lg shadow-lg animate-fadeIn flex items-center gap-3 ${TYPE_STYLES[type] || TYPE_STYLES.info}`}
    >
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="بستن" className="text-white/80 hover:text-white">
        ×
      </button>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  duration: PropTypes.number,
  onClose: PropTypes.func,
};

export default Toast;
