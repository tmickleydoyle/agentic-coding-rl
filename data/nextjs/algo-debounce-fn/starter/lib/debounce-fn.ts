export interface DebouncedFn<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, wait: number): DebouncedFn<T> {
  throw new Error('not implemented');
}

export interface ThrottledFn<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel(): void;
}

export function throttle<T extends (...args: unknown[]) => void>(fn: T, limit: number): ThrottledFn<T> {
  throw new Error('not implemented');
}
