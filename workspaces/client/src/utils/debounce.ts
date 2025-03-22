export interface DebouncedFunction<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
}

export interface DebounceOptions {
  immediate?: boolean;
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastCallTime: number | undefined;

  function invokeFunc(thisArg: ThisParameterType<T>): void {
    const args = lastArgs;
    lastArgs = undefined;
    func.apply(thisArg, args ?? []);
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    return lastCallTime === undefined || timeSinceLastCall >= wait;
  }

  function trailingEdge(_time: number, thisArg: ThisParameterType<T>): void {
    timeoutId = undefined;

    if (lastArgs) {
      invokeFunc(thisArg);
    }
  }

  function createTimerExpired(thisArg: ThisParameterType<T>) {
    return function timerExpired(): void {
      const time = Date.now();
      if (shouldInvoke(time)) {
        trailingEdge(time, thisArg);
        return;
      }
      // Restart the timer
      const timeSinceLastCall = time - (lastCallTime ?? 0);
      const timeWaiting = wait - timeSinceLastCall;
      timeoutId = setTimeout(timerExpired, timeWaiting);
    };
  }

  function debounced(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const time = Date.now();
    lastArgs = args;
    lastCallTime = time;

    if (timeoutId === undefined) {
      if (options.immediate) {
        func.apply(this, args);
      } else {
        timeoutId = setTimeout(createTimerExpired(this), wait);
      }
      return;
    }

    if (!options.immediate) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(createTimerExpired(this), wait);
    }
  }

  debounced.cancel = function(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    lastArgs = undefined;
    lastCallTime = undefined;
  };

  debounced.flush = function(this: ThisParameterType<T>): void {
    if (timeoutId !== undefined) {
      trailingEdge(Date.now(), this);
      debounced.cancel();
    }
  };

  debounced.pending = function(): boolean {
    return timeoutId !== undefined;
  };

  return debounced;
}