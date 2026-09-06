import { useState, useEffect, useCallback } from 'react';
import * as paymentService from '../services/paymentService';

/**
 * Hook exposing payment operations (create, verify) plus the user's payment
 * history, with loading/error state. Used by the Checkout and History pages.
 */
export const usePayment = ({ loadHistory = false } = {}) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(loadHistory);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getPaymentHistory();
      setHistory(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loadHistory) fetchHistory();
  }, [loadHistory, fetchHistory]);

  const createPayment = useCallback(async (payload) => {
    setProcessing(true);
    setError(null);
    try {
      return await paymentService.createPayment(payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, []);

  const verifyPayment = useCallback(async (payload) => {
    setProcessing(true);
    setError(null);
    try {
      return await paymentService.verifyPayment(payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, []);

  const getInvoice = useCallback(async (paymentId) => {
    return paymentService.getInvoice(paymentId);
  }, []);

  return {
    history,
    loading,
    error,
    processing,
    refetch: fetchHistory,
    createPayment,
    verifyPayment,
    getInvoice,
  };
};

export default usePayment;
