import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, formatDateTime, formatCurrency, formatProgress } from '../utils/formatters';

describe('formatters', () => {
  it('formats a date in fa-IR locale', () => {
    expect(formatDate('2024-01-15T10:00:00Z')).not.toBe('');
  });

  it('returns empty string for invalid date input', () => {
    expect(formatDate('not-a-date')).toBe('');
    expect(formatDate(null)).toBe('');
  });

  it('formats time', () => {
    expect(formatTime('2024-01-15T10:00:00Z')).not.toBe('');
  });

  it('formats date and time together', () => {
    const result = formatDateTime('2024-01-15T10:00:00Z');
    expect(result).toContain(' - ');
  });

  it('formats currency', () => {
    const result = formatCurrency(150000, 'IRR');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns empty string for invalid currency amount', () => {
    expect(formatCurrency(undefined)).toBe('');
    expect(formatCurrency('not-a-number')).toBe('');
  });

  describe('formatProgress', () => {
    it('computes a percentage between 0 and 100', () => {
      expect(formatProgress(5, 10)).toBe(50);
      expect(formatProgress(0, 10)).toBe(0);
      expect(formatProgress(10, 10)).toBe(100);
    });

    it('clamps values above target or below zero', () => {
      expect(formatProgress(20, 10)).toBe(100);
      expect(formatProgress(-5, 10)).toBe(0);
    });

    it('returns 0 when target is missing or zero', () => {
      expect(formatProgress(5, 0)).toBe(0);
      expect(formatProgress(5, undefined)).toBe(0);
    });
  });
});
