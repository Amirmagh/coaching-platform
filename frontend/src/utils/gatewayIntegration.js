/**
 * Payment gateway (ZarinPal) helpers: building the redirect URL and parsing
 * the callback query string ZarinPal appends when returning the user.
 */
import gateways from '../data/gateways.json';

// Builds the ZarinPal StartPay redirect URL for a given authority token.
export const buildZarinPalRedirectUrl = (authority) => {
  if (!authority) return '';
  return `${gateways.zarinpal.startPayUrl}${authority}`;
};

/**
 * Parses the gateway callback URL (typically `window.location.search`) and
 * returns `{ authority, status }`. ZarinPal returns `Status` and `Authority`.
 */
export const parseGatewayCallback = (search = '') => {
  const params = new URLSearchParams(search);
  return {
    authority: params.get('Authority') || params.get('authority') || '',
    status: params.get('Status') || params.get('status') || '',
  };
};

// Returns true when the gateway reports a successful payment callback.
export const isPaymentSuccessful = (status) => String(status).toUpperCase() === 'OK';

// Maps a backend payment status value to a Farsi label for display.
export const paymentStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return 'موفق';
    case 'pending':
      return 'در انتظار';
    case 'failed':
      return 'ناموفق';
    default:
      return status || '';
  }
};

export default {
  buildZarinPalRedirectUrl,
  parseGatewayCallback,
  isPaymentSuccessful,
  paymentStatusLabel,
};
