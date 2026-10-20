import { useState, useEffect, useCallback, useRef } from 'react';
import * as emailService from '../services/emailService';

const RESEND_COOLDOWN = 60; // seconds

/**
 * Hook managing the email verification flow: verifying a token, resending the
 * verification email with a cooldown countdown, and tracking status messages.
 */
export const useEmailVerification = () => {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef(null);

  // Countdown timer for the resend button cooldown.
  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    timerRef.current = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [resendCooldown]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const verifyToken = useCallback(async (token) => {
    if (!token) {
      setError('توکن نامعتبر است');
      return false;
    }
    setVerifying(true);
    setError(null);
    try {
      await emailService.verifyEmailToken(token);
      setVerified(true);
      setMessage('ایمیل شما با موفقیت تأیید شد.');
      return true;
    } catch (err) {
      setError('توکن نامعتبر یا منقضی شده است.');
      return false;
    } finally {
      setVerifying(false);
    }
  }, []);

  const resend = useCallback(async () => {
    if (resendCooldown > 0) return false;
    setError(null);
    try {
      await emailService.sendVerificationEmail();
      setMessage('ایمیل تأیید مجدداً ارسال شد.');
      setResendCooldown(RESEND_COOLDOWN);
      return true;
    } catch (err) {
      setError('ارسال ایمیل با خطا مواجه شد.');
      return false;
    }
  }, [resendCooldown]);

  return {
    verifying,
    verified,
    error,
    message,
    resendCooldown,
    verifyToken,
    resend,
  };
};

export default useEmailVerification;
