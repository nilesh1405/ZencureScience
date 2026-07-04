export const generateUsername = (name, phone) => {
  const phoneStr = String(phone);

  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  return `${cleanName}${phoneStr.slice(-4)}`;
};

export const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};