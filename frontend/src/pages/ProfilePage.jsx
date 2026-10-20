import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../components/Common/FormInput';
import { Modal } from '../components/Common/Modal';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateEmail, validatePassword, validatePasswordConfirmation, validateRequired, validatePhone } from '../utils/validators';
import * as userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';

/**
 * Profile page: edit profile, change password, account settings, delete account.
 */
export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('fa');

  const profileForm = useFormValidation(
    { name: '', email: '', bio: '', phone: '' },
    {
      name: (value) => validateRequired(value, 'نام'),
      email: validateEmail,
      phone: (value) => validatePhone(value, { required: false }),
    }
  );

  const passwordForm = useFormValidation(
    { currentPassword: '', newPassword: '', confirmPassword: '' },
    {
      currentPassword: (value) => validateRequired(value, 'رمز عبور فعلی'),
      newPassword: validatePassword,
      confirmPassword: (value, all) => validatePasswordConfirmation(all.newPassword, value),
    }
  );

  useEffect(() => {
    if (user) {
      profileForm.handleChange('name', user.name || '');
      profileForm.handleChange('email', user.email || '');
      profileForm.handleChange('bio', user.bio || '');
      profileForm.handleChange('phone', user.phone || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!profileForm.validateAll()) return;
    try {
      await userService.updateProfile(profileForm.values);
      setMessage('پروفایل با موفقیت به‌روزرسانی شد.');
    } catch {
      setMessage('خطا در به‌روزرسانی پروفایل.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!passwordForm.validateAll()) return;
    try {
      await userService.changePassword({
        currentPassword: passwordForm.values.currentPassword,
        newPassword: passwordForm.values.newPassword,
      });
      setMessage('رمز عبور با موفقیت تغییر کرد.');
      passwordForm.reset();
      setShowPasswordForm(false);
    } catch {
      setMessage('خطا در تغییر رمز عبور.');
    }
  };

  const handleSettingsChange = async (settings) => {
    try {
      await userService.updateSettings(settings);
    } catch {
      // Non-blocking: settings are still reflected locally.
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      logout();
      navigate('/');
    } catch {
      setMessage('حذف حساب کاربری ناموفق بود.');
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">پروفایل کاربری</h1>

      {message && (
        <p className="text-sm text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-200 p-3 rounded-lg">
          {message}
        </p>
      )}

      {/* Edit profile */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ویرایش اطلاعات</h2>
        <form onSubmit={handleProfileSubmit} noValidate>
          <FormInput
            label="نام"
            name="name"
            value={profileForm.values.name}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={profileForm.errors.name}
            required
          />
          <FormInput
            label="ایمیل"
            name="email"
            type="email"
            value={profileForm.values.email}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={profileForm.errors.email}
            required
          />
          <FormInput
            label="شماره موبایل"
            name="phone"
            value={profileForm.values.phone}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={profileForm.errors.phone}
          />
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              درباره من
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={profileForm.values.bio}
              onChange={(e) => profileForm.handleChange('bio', e.target.value)}
              className="input resize-none"
            />
          </div>
          <button type="submit" className="btn-primary">
            ذخیره تغییرات
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">تغییر رمز عبور</h2>
          <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setShowPasswordForm((v) => !v)}>
            {showPasswordForm ? 'انصراف' : 'تغییر رمز عبور'}
          </button>
        </div>
        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} noValidate>
            <FormInput
              label="رمز عبور فعلی"
              name="currentPassword"
              type="password"
              value={passwordForm.values.currentPassword}
              onChange={passwordForm.handleChange}
              onBlur={passwordForm.handleBlur}
              error={passwordForm.errors.currentPassword}
              required
            />
            <FormInput
              label="رمز عبور جدید"
              name="newPassword"
              type="password"
              value={passwordForm.values.newPassword}
              onChange={passwordForm.handleChange}
              onBlur={passwordForm.handleBlur}
              error={passwordForm.errors.newPassword}
              required
            />
            <FormInput
              label="تکرار رمز عبور جدید"
              name="confirmPassword"
              type="password"
              value={passwordForm.values.confirmPassword}
              onChange={passwordForm.handleChange}
              onBlur={passwordForm.handleBlur}
              error={passwordForm.errors.confirmPassword}
              required
            />
            <button type="submit" className="btn-primary">
              اعمال تغییر رمز عبور
            </button>
          </form>
        )}
      </div>

      {/* Account settings */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">تنظیمات حساب</h2>
        <label className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">اعلان‌ها</span>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => {
              setNotificationsEnabled(e.target.checked);
              handleSettingsChange({ notifications_enabled: e.target.checked });
            }}
            className="rounded"
          />
        </label>
        <div>
          <label htmlFor="language" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            زبان
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              handleSettingsChange({ language: e.target.value });
            }}
            className="input"
          >
            <option value="fa">فارسی</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Delete account */}
      <div className="card border border-red-200 dark:border-red-900">
        <h2 className="text-lg font-bold text-red-600 mb-2">حذف حساب کاربری</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          این عملیات غیرقابل بازگشت است و تمام اطلاعات شما حذف خواهد شد.
        </p>
        <button type="button" className="btn-danger" onClick={() => setShowDeleteModal(true)}>
          حذف حساب کاربری
        </button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="حذف حساب کاربری"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
              انصراف
            </button>
            <button type="button" className="btn-danger" onClick={handleDeleteAccount}>
              بله، حذف کن
            </button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          آیا از حذف حساب کاربری خود مطمئن هستید؟ این عملیات قابل بازگشت نیست.
        </p>
      </Modal>
    </div>
  );
};

export default ProfilePage;
