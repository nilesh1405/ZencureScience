export function isValidEmail(email) {
  if (!email || email.length > 254) {
    return false;
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidDOB(dob) {
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) {
    return false;
  }
  if (birthDate > new Date()) {
    return false;
  }

  return true;
}

export function validateName(name) {
  return name.length >= 3 && name.length <= 50;
}

export function validatePhone(phone) {
  const regex = /^\d{10}$/;
  return regex.test(phone);
}
