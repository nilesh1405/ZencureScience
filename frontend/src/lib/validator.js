// src/lib/validators.js

export const isValidEmail = (email) => {
  if (typeof email !== "string") return false;

  email = email.trim();

  if (email.length < 5 || email.length > 254) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

export const validateName = (name) => {
  return (
    typeof name === "string" &&
    name.trim().length >= 2 &&
    name.trim().length <= 50
  );
};

export const isValidDOB = (dob) => {
  const date = new Date(dob);

  if (isNaN(date.getTime())) return false;
  if (date > new Date()) return false;

  return true;
};

export const validatePassword = (password) => {
  return password.length >= 8;
};
