import React, { useMemo, useState } from 'react';
import { SessionCard } from '../components/Dashboard/SessionCard';
import { Modal } from '../components/Common/Modal';
import { useSessions } from '../hooks/useSessions';
import * as coachingService from '../services/coachingService';
import { formatDateTime } from '../utils/formatters';
import { SESSION_STATUS } from '../utils/constants';

/**
 * Session history page: all past sessions, filterable by date/status/goal,
 * with a details modal and transcript export.
 */
export const SessionHistoryPage = () => {
  const { sessions, loading } = useSessions();
  const [statusFilter, setStatusFilter] = useState('all');
  const [goalFilter, setGoalFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [exporting, setExporting] = useState(false);

  const goalOptions = useMemo(() => {
    const unique = new Map();
    sessions.forEach((s) => {
      if (s.goal_title) unique.set(s.goal_title, s.goal_title);
    });
    return Array.from(unique.values());
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (goalFilter !== 'all' && s.goal_title !== goalFilter) return false;
      if (dateFilter && s.created_at && !s.created_at.startsWith(dateFilter)) return false;
      return true;
    });
  }, [sessions, statusFilter, goalFilter, dateFilter]);

  const openDetails = async (session) => {
    setSelectedSession(session);
    setTranscript(null);
    try {
      const data = await coachingService.getTranscript(session.id);
      setTranscript(data);
    } catch {
      setTranscript({ messages: [] });
    }
  };

  const handleExport = async () => {
    if (!selectedSession) return;
    setExporting(true);
    try {
      const data = transcript || (await coachingService.getTranscript(selectedSession.id));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `session-${selectedSession.id}-transcript.json`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تاریخچه جلسات</h1>

      {/* Filters */}
      <div className="card flex flex-wrap gap-4">
        <div>
          <label htmlFor="statusFilter" className="block text-xs text-gray-500 mb-1">وضعیت</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="all">همه</option>
            {Object.values(SESSION_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="goalFilter" className="block text-xs text-gray-500 mb-1">هدف</label>
          <select
            id="goalFilter"
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="input"
          >
            <option value="all">همه</option>
            {goalOptions.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dateFilter" className="block text-xs text-gray-500 mb-1">تاریخ</label>
          <input
            id="dateFilter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
      ) : filteredSessions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">جلسه‌ای یافت نشد.</p>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <SessionCard key={session.id} session={session} onClick={openDetails} />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        title={selectedSession?.title || 'جزئیات جلسه'}
        footer={
          <button type="button" className="btn-primary" disabled={exporting} onClick={handleExport}>
            {exporting ? 'در حال خروجی گرفتن...' : 'دریافت متن گفتگو'}
          </button>
        }
      >
        {selectedSession && (
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>وضعیت: {selectedSession.status}</p>
            {selectedSession.created_at && <p>تاریخ: {formatDateTime(selectedSession.created_at)}</p>}
            {transcript?.messages?.length > 0 ? (
              <ul className="space-y-1 max-h-64 overflow-y-auto">
                {transcript.messages.map((msg, idx) => (
                  <li key={msg.id || idx}>{msg.text}</li>
                ))}
              </ul>
            ) : (
              <p>متن گفتگویی برای نمایش وجود ندارد.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SessionHistoryPage;
