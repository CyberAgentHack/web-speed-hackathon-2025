// パスワードの正規表現をコンパイル済みのパターンとして保持
const PASSWORD_PATTERN = /^[A-Z0-9_+-]{3,}$/i;

export const isValidPassword = (password: string): boolean => {
  // 長さの事前チェック
  if (password.length < 3) {
    return false;
  }
  return PASSWORD_PATTERN.test(password);
};