/**
 * 指定した時間内に連続して呼ばれた関数の実行を一度だけに制限するデバウンス関数
 * @param func 実行する関数
 * @param waitMs 待機時間（ミリ秒）
 * @returns デバウンスされた関数
 */
export function debounce<F extends (...args: unknown[]) => void>(func: F, waitMs: number): (...args: Parameters<F>) => void
{
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<F>)
  {
    if (timeoutId != null)
    {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() =>
    {
      func(...args);
      timeoutId = null;
    }, waitMs);
  };
} 