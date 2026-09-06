/**
 * Currency formatting helpers for Iranian Rial (IRR) with optional
 * Persian (Eastern Arabic) numerals and thousand separators. Kept separate
 * from the generic `formatters.js` so payment-specific logic stays in one place.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

// Converts Latin digits in a string to Persian digits.
export const toPersianDigits = (value) =>
  String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);

// Adds thousand separators to a numeric value (Latin digits).
export const addThousandSeparators = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return '';
  return Number(value).toLocaleString('en-US');
};

/**
 * Formats an IRR amount. By default returns Persian digits with thousand
 * separators followed by the "تومان"/"ریال" label. Pass `{ persian: false }`
 * to keep Latin digits.
 */
export const formatIRR = (amount, { persian = true, withUnit = true, unit = 'تومان' } = {}) => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) return '';
  const separated = addThousandSeparators(amount);
  const digits = persian ? toPersianDigits(separated) : separated;
  return withUnit ? `${digits} ${unit}` : digits;
};

// Converts Rial to Toman (1 Toman = 10 Rial) and formats it.
export const rialsToToman = (rials) => {
  if (rials === undefined || rials === null || Number.isNaN(Number(rials))) return '';
  return formatIRR(Number(rials) / 10);
};

export default { formatIRR, toPersianDigits, addThousandSeparators, rialsToToman };
