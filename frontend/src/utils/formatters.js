/**
 * Formatting helpers for dates, times and currency, with Farsi (fa-IR)
 * output by default so the UI stays RTL/locale friendly.
 */

export const formatDate = (value, locale = 'fa-IR') => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (value, locale = 'fa-IR') => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (value, locale = 'fa-IR') => {
  if (!value) return '';
  return `${formatDate(value, locale)} - ${formatTime(value, locale)}`;
};

export const formatCurrency = (amount, currency = 'IRR', locale = 'fa-IR') => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) return '';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  } catch {
    return `${Number(amount).toLocaleString(locale)} ${currency}`;
  }
};

// Returns a percentage (0-100) rounded to the nearest integer.
export const formatProgress = (current, target) => {
  if (!target || target <= 0) return 0;
  const percent = (Number(current) / Number(target)) * 100;
  return Math.max(0, Math.min(100, Math.round(percent)));
};
