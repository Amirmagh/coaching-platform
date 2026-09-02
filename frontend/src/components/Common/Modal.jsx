import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable, accessible modal dialog. Closes on overlay click or Escape key.
 */
export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
};

export default Modal;
