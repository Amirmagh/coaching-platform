import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '../components/Common/FormInput';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateEmail, validatePassword } from '../utils/validators';

/**
 * Login page: email/password form, remember me, forgot password, sign up link.
 */
export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { values, errors, handleChange, handleBlur, validateAll } = useFormValidation(
    { email: '', password: '' },
    {
      email: validateEmail,
      password: (value) => (value ? null : 'رمز عبور الزامی است'),
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateAll()) return;

    setSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch {
      setSubmitError('ایمیل یا رمز عبور اشتباه است');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="card animate-fadeIn">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">ورود</h1>

        {submitError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
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

          <div className="flex justify-between items-center mb-6 text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded"
              />
              مرا به خاطر بسپار
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              رمز عبور را فراموش کرده‌اید؟
            </Link>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          حساب کاربری ندارید؟{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            ثبت نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
