import React from 'react';

export const ChatMessage = ({ message, isUser, showResources = false }) => {
  return (
    <div
      className={`flex gap-3 mb-4 animate-slideInLeft ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gradient-to-br from-teal-500 to-blue-600 text-white'
        }`}
      >
        {isUser ? 'شما' : 'کوچ'}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-xs lg:max-w-md card ${
          isUser
            ? 'bg-blue-600 text-white rounded-tl-none'
            : 'bg-gray-50 dark:bg-gray-700 rounded-tr-none'
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
        {message.timestamp && (
          <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString('fa-IR')}
          </p>
        )}
      </div>

      {/* Crisis Resources */}
      {showResources && !isUser && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-lg border-r-4 border-red-600">
          <h4 className="font-bold text-red-800 dark:text-red-100 mb-2">
            🆘 منابع بحران (ایران)
          </h4>
          <ul className="space-y-2 text-sm text-red-700 dark:text-red-200">
            <li>📞 کمیته امداد: <span className="font-bold">1480</span></li>
            <li>🚑 اورژانس: <span className="font-bold">115</span></li>
            <li>💬 مشاوره روانی: <span className="font-bold">123</span></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
