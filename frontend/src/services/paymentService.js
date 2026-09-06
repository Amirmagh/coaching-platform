import api from './api';

/**
 * Payment service: creating payment requests, verifying callbacks, fetching
 * history and downloading invoices. Wraps the shared axios `api` client and
 * maps to the backend `/payments/` endpoints.
 */

export const createPayment = async ({ amount, gateway = 'zarinpal', metadata = {} }) => {
  const { data } = await api.post('/payments/create/', { amount, gateway, metadata });
  return data;
};

export const verifyPayment = async ({ paymentId, authority }) => {
  const { data } = await api.post('/payments/verify/', {
    payment_id: paymentId,
    authority,
  });
  return data;
};

export const getPaymentHistory = async () => {
  const { data } = await api.get('/payments/history/');
  return data;
};

export const getInvoice = async (paymentId) => {
  const { data } = await api.get(`/payments/invoices/${paymentId}/`);
  return data;
};

export default { createPayment, verifyPayment, getPaymentHistory, getInvoice };
