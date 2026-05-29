export function debounce<F extends (...args: any[]) => void>(
  fn: F,
  ms: number,
): (...args: Parameters<F>) => void {
  // TODO: implement debounce
  void fn;
  void ms;
  return () => {
    throw new Error('not implemented');
  };
}
