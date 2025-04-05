export const isValidEmail = (email: string): boolean => {
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const localPart = parts[0] as string;
  const domainPart = parts[1] as string;

  if (!/^[\w+-]+(?:\.[\w+-]+)*$/.test(localPart)) {
    return false;
  }
  if (!/^[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.[A-Z]{2,}$/i.test(domainPart)) {
    return false;
  }

  return true;
};
