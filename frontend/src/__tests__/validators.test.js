import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  validateEmail,
  isValidPassword,
  validatePassword,
  validatePasswordConfirmation,
  isValidPhone,
  validatePhone,
  validateRequired,
} from '../utils/validators';

describe('validators', () => {
  describe('email', () => {
    it('accepts valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(validateEmail('user@example.com')).toBeNull();
    });

    it('rejects invalid emails', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(validateEmail('not-an-email')).toBe('فرمت ایمیل نامعتبر است');
    });

    it('requires a value', () => {
      expect(validateEmail('')).toBe('ایمیل الزامی است');
    });
  });

  describe('password', () => {
    it('accepts a strong password', () => {
      expect(isValidPassword('abc12345')).toBe(true);
      expect(validatePassword('abc12345')).toBeNull();
    });

    it('rejects short passwords', () => {
      expect(validatePassword('abc1')).toContain('حداقل');
    });

    it('rejects passwords without both letters and numbers', () => {
      expect(validatePassword('abcdefgh')).toContain('حروف و اعداد');
      expect(validatePassword('12345678')).toContain('حروف و اعداد');
    });

    it('validates password confirmation match', () => {
      expect(validatePasswordConfirmation('abc12345', 'abc12345')).toBeNull();
      expect(validatePasswordConfirmation('abc12345', 'other123')).toBe(
        'رمز عبور و تکرار آن یکسان نیستند'
      );
      expect(validatePasswordConfirmation('abc12345', '')).toBe('تکرار رمز عبور الزامی است');
    });
  });

  describe('phone', () => {
    it('accepts valid Iranian mobile numbers', () => {
      expect(isValidPhone('09123456789')).toBe(true);
      expect(isValidPhone('+989123456789')).toBe(true);
    });

    it('rejects invalid numbers', () => {
      expect(isValidPhone('12345')).toBe(false);
      expect(validatePhone('12345')).toBe('شماره موبایل نامعتبر است');
    });

    it('is optional unless required', () => {
      expect(validatePhone('')).toBeNull();
      expect(validatePhone('', { required: true })).toBe('شماره موبایل الزامی است');
    });
  });

  describe('validateRequired', () => {
    it('flags empty values', () => {
      expect(validateRequired('', 'نام')).toBe('نام الزامی است');
      expect(validateRequired('   ', 'نام')).toBe('نام الزامی است');
    });

    it('passes non-empty values', () => {
      expect(validateRequired('Ali', 'نام')).toBeNull();
    });
  });
});
