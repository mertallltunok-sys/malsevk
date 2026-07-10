// Form validation utilities

export interface PasswordValidation {
  isValid: boolean;
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  noSpaces: boolean;
}

export const validatePassword = (password: string): PasswordValidation => {
  return {
    isValid:
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
      !/\s/.test(password),
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noSpaces: !/\s/.test(password),
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateTurkishPhone = (phone: string): boolean => {
  // Türkiye telefon formatı: 05XX XXX XX XX veya 5XXXXXXXXX
  const phoneRegex = /^(05|5)[0-9]{9}$/;
  const cleanPhone = phone.replace(/\s/g, "");
  return phoneRegex.test(cleanPhone);
};

export const formatTurkishPhone = (phone: string): string => {
  // Telefonu 05XX XXX XX XX formatına çevir
  const cleanPhone = phone.replace(/\s/g, "");
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }
  return phone;
};
