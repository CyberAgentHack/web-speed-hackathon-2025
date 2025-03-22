export const isValidEmail = (email: string): boolean => {
  return /@/.test(email);
};
