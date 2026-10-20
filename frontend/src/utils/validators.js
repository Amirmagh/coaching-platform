import { PASSWORD_MIN_LENGTH } from './constants';

/**
 * Validation helpers shared by forms across the app (Login, Signup, Profile).
 * Every validator returns `null` when the value is valid, or a human
 * readable Farsi error message otherwise, so it can be rendered directly.
 */

export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
};

export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'ایمیل الزامی است';
  if (!isValidEmail(email)) return 'فرمت ایمیل نامعتبر است';
  return null;
};

export const isValidPassword = (password) =>
  typeof password === 'string' && password.length >= PASSWORD_MIN_LENGTH;

export const validatePassword = (password) => {
  if (!password) return 'رمز عبور الزامی است';
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `رمز عبور باید حداقل ${PASSWORD_MIN_LENGTH} کاراکتر باشد`;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'رمز عبور باید شامل حروف و اعداد باشد';
  }
  return null;
};

export const validatePasswordConfirmation = (password, confirmation) => {
  if (!confirmation) return 'تکرار رمز عبور الزامی است';
  if (password !== confirmation) return 'رمز عبور و تکرار آن یکسان نیستند';
  return null;
};

// Accepts Iranian mobile numbers (e.g. 09123456789 or +989123456789).
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const re = /^(\+98|0)?9\d{9}$/;
  return re.test(String(phone).trim());
};

export const validatePhone = (phone, { required = false } = {}) => {
  if (!phone || !phone.trim()) {
    return required ? 'شماره موبایل الزامی است' : null;
  }
  if (!isValidPhone(phone)) return 'شماره موبایل نامعتبر است';
  return null;
};

export const validateRequired = (value, fieldName = 'این فیلد') => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName} الزامی است`;
  }
  return null;
};
