export interface DebouncedFn<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, wait: number): DebouncedFn<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (lastArgs !== null) {
        fn(...lastArgs);
        lastArgs = null;
      }
    }, wait);
  }) as DebouncedFn<T>;

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
      if (lastArgs !== null) {
        fn(...lastArgs);
        lastArgs = null;
      }
    }
  };

  return debounced;
}

export interface ThrottledFn<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel(): void;
}

export function throttle<T extends (...args: unknown[]) => void>(fn: T, limit: number): ThrottledFn<T> {
  let lastCall = -Infinity;

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  }) as ThrottledFn<T>;

  throttled.cancel = () => {
    lastCall = -Infinity;
  };

  return throttled;
}
