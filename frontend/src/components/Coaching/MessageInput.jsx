import React, { useState } from 'react';

export const MessageInput = ({ onSend, disabled = false, loading = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled && !loading) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mt-6">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="پاسخ خود را اینجا بنویسید..."
        rows="3"
        disabled={disabled || loading}
        className="input flex-1 resize-none"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled || loading}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          message.trim() && !disabled && !loading
            ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <span className="animate-spin">⊙</span>
        ) : (
          '✓ ارسال'
        )}
      </button>
    </form>
  );
};

export default MessageInput;
