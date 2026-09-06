import { useState, useCallback } from 'react';

/**
 * Generic form validation hook.
 *
 * @param {Object} initialValues - initial field values, e.g. { email: '' }
 * @param {Object} validationRules - map of fieldName -> (value, allValues) => errorMessage|null
 */
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (name, value, allValues = values) => {
      const rule = validationRules[name];
      if (!rule) return null;
      return rule(value, allValues);
    },
    [validationRules, values]
  );

  const validateAll = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach((name) => {
      const message = validateField(name, values[name], values);
      if (message) newErrors[name] = message;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules, values, validateField]);

  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, { ...values, [name]: value }) }));
    },
    [validateField, values]
  );

  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValid = Object.values(errors).every((message) => !message);

  return { values, errors, touched, handleChange, handleBlur, validateAll, reset, isValid };
};

export default useFormValidation;
