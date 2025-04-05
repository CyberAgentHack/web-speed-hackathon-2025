export const isValidPassword = (password: string): boolean => {
  return /^[\w+-]{3,}$/.test(password);
};
