import { useState, useEffect, useCallback } from 'react';
import * as goalService from '../services/goalService';

/**
 * Hook exposing goals data plus create/update/delete operations, with
 * simple loading/error state management for consuming pages.
 */
export const useGoals = (params = {}) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await goalService.getGoals(params);
      setGoals(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(async (payload) => {
    const goal = await goalService.createGoal(payload);
    setGoals((prev) => [goal, ...prev]);
    return goal;
  }, []);

  const editGoal = useCallback(async (goalId, payload) => {
    const goal = await goalService.updateGoal(goalId, payload);
    setGoals((prev) => prev.map((g) => (g.id === goalId ? goal : g)));
    return goal;
  }, []);

  const removeGoal = useCallback(async (goalId) => {
    await goalService.deleteGoal(goalId);
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }, []);

  return { goals, loading, error, refetch: fetchGoals, addGoal, editGoal, removeGoal };
};

export default useGoals;
