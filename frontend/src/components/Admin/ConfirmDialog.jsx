import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../Common/Modal';

/**
 * Reusable confirmation dialog built on the shared `Modal`. Supports a
 * loading state on the confirm action and a danger styling for destructive
 * operations (delete/ban/refund).
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'تأیید عملیات',
  message = 'آیا از انجام این عملیات مطمئن هستید؟',
  confirmLabel = 'تأیید',
  cancelLabel = 'انصراف',
  loading = false,
  danger = false,
}) => {
  const footer = (
    <>
      <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className={danger ? 'btn-danger' : 'btn-primary'}
      >
        {loading ? 'در حال انجام...' : confirmLabel}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} title={title} footer={footer}>
      <p className="text-gray-700 dark:text-gray-300">{message}</p>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  loading: PropTypes.bool,
  danger: PropTypes.bool,
};

export default ConfirmDialog;
