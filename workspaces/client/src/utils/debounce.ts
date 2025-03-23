type AnyFunction = (...args: unknown[]) => void;

export function createDebounce<T extends AnyFunction>(func: T, wait: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return ((...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = undefined;
    }, wait);
  }) as T;
}
