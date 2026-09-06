import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '../components/Common/FormInput';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateEmail, validatePassword, validatePasswordConfirmation, validateRequired } from '../utils/validators';
import * as authService from '../services/authService';

/**
 * Signup page: name/email/password fields, terms acceptance, login redirect.
 */
export const SignupPage = () => {
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { values, errors, handleChange, handleBlur, validateAll } = useFormValidation(
    { name: '', email: '', password: '', confirmPassword: '' },
    {
      name: (value) => validateRequired(value, 'نام'),
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (value, all) => validatePasswordConfirmation(all.password, value),
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!acceptedTerms) {
      setSubmitError('برای ثبت نام باید قوانین را بپذیرید');
      return;
    }
    if (!validateAll()) return;

    setSubmitting(true);
    try {
      await authService.signup({ name: values.name, email: values.email, password: values.password });
      navigate('/login');
    } catch {
      setSubmitError('ثبت نام ناموفق بود. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="card animate-fadeIn">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">ثبت نام</h1>

        {submitError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="نام"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            required
          />
          <FormInput
            label="ایمیل"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
          />
          <FormInput
            label="رمز عبور"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            required
          />
          <FormInput
            label="تکرار رمز عبور"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            required
          />

          <label className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="rounded"
            />
            <span>
              <Link to="/terms" className="text-blue-600 hover:underline">
                قوانین و مقررات
              </Link>{' '}
              را می‌پذیرم
            </span>
          </label>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'در حال ثبت نام...' : 'ثبت نام'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          قبلاً ثبت نام کرده‌اید؟{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
