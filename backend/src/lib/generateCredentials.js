import crypto from "crypto";

export const generateUsername = (name, phone) => {
  const phoneStr = String(phone);

  const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");

  return `${cleanName}${phoneStr.slice(-4)}`;
};

export const generatePassword = () => {
  const password = crypto.randomBytes(6).toString("base64");
  return password;
};
