export const isValidPassword = (password: string): boolean => {
  return /^[A-Z0-9_+-]{3,}$/i.test(password);
};
