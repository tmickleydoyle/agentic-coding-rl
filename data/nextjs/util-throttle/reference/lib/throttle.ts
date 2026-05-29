export function throttle<F extends (...args: any[]) => void>(
  fn: F,
  ms: number,
): (...args: Parameters<F>) => void {
  let lastCall = -Infinity;
  return (...args: Parameters<F>): void => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
}
