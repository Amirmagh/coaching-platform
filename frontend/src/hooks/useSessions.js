import { useState, useEffect, useCallback } from 'react';
import * as coachingService from '../services/coachingService';

/**
 * Hook exposing coaching sessions data plus create/update operations, with
 * loading/error state management for the Dashboard and History pages.
 */
export const useSessions = (params = {}) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await coachingService.getSessions(params);
      setSessions(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const startSession = useCallback(async (payload) => {
    const session = await coachingService.createSession(payload);
    setSessions((prev) => [session, ...prev]);
    return session;
  }, []);

  const editSession = useCallback(async (sessionId, payload) => {
    const session = await coachingService.updateSession(sessionId, payload);
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? session : s)));
    return session;
  }, []);

  return { sessions, loading, error, refetch: fetchSessions, startSession, editSession };
};

export default useSessions;
