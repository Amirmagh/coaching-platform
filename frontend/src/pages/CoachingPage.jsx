import React, { useState } from 'react';
import { ChatMessage } from '../components/Coaching/ChatMessage';
import { MessageInput } from '../components/Coaching/MessageInput';
import * as coachingService from '../services/coachingService';

/**
 * Coaching session page: GROW question flow chat interface.
 */
export const CoachingPage = () => {
  const [messages, setMessages] = useState([
    { text: 'سلام! امروز می‌خواهید روی چه هدفی کار کنیم؟', timestamp: new Date().toISOString() },
  ]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { text, isUser: true, timestamp: new Date().toISOString() }]);
    setLoading(true);
    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const session = await coachingService.createSession();
        currentSessionId = session.id;
        setSessionId(currentSessionId);
      }
      const response = await coachingService.sendMessage(currentSessionId, text);
      setMessages((prev) => [
        ...prev,
        { text: response.text, timestamp: response.timestamp || new Date().toISOString() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: 'خطا در برقراری ارتباط. لطفاً دوباره تلاش کنید.', timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">جلسه کوچینگ</h1>
      <div className="card">
        {messages.map((message, idx) => (
          <ChatMessage key={idx} message={message} isUser={!!message.isUser} />
        ))}
        <MessageInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
};

export default CoachingPage;
