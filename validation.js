/**
 * PulseFlow AI - Form Validation Utility
 * Provides client-side validation, error display, and field sanitization.
 */

// Email regex pattern meeting RFC 5322 standard basics
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

export const validators = {
  required: (val, fieldName = 'Field') => {
    return val && val.trim().length > 0 ? null : `${fieldName} is required.`;
  },

  email: (val) => {
    if (!val || !val.trim()) return 'Work email is required.';
    if (!EMAIL_REGEX.test(val.trim())) return 'Please enter a valid email address (e.g. name@company.com).';
    return null;
  },

  minLength: (min) => (val, fieldName = 'Field') => {
    if (!val || val.trim().length < min) {
      return `${fieldName} must be at least ${min} characters.`;
    }
    return null;
  },

  password: (val) => {
    if (!val || val.length < 8) return 'Password must be at least 8 characters long.';
    return null;
  }
};

/**
 * Validate an individual input element and toggle its error message and styling.
 * @param {HTMLElement} inputEl
 * @param {Function[]} rules - array of validation functions
 * @returns {boolean} - true if valid, false if invalid
 */
export function validateField(inputEl, rules = []) {
  const value = inputEl.value;
  const fieldName = inputEl.getAttribute('data-field-name') || inputEl.name || 'Field';
  const errorContainer = document.getElementById(`${inputEl.id}-error`);

  let errorMessage = null;
  for (const rule of rules) {
    const error = rule(value, fieldName);
    if (error) {
      errorMessage = error;
      break;
    }
  }

  if (errorMessage) {
    inputEl.classList.add('is-invalid');
    inputEl.classList.remove('is-valid');
    if (errorContainer) {
      errorContainer.textContent = errorMessage;
      errorContainer.classList.add('visible');
    }
    return false;
  } else {
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
    if (errorContainer) {
      errorContainer.textContent = '';
      errorContainer.classList.remove('visible');
    }
    return true;
  }
}

/**
 * Reset all visual validation states on a form
 * @param {HTMLFormElement} form
 */
export function resetFormValidation(form) {
  form.reset();
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  inputs.forEach(input => {
    input.classList.remove('is-invalid', 'is-valid');
  });
  const errors = form.querySelectorAll('.form-feedback');
  errors.forEach(err => {
    err.textContent = '';
    err.classList.remove('visible');
  });
}

