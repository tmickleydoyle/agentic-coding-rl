export function retry<T>(fn: () => Promise<T>, attempts: number): Promise<T> {
  // TODO: implement
  void fn;
  void attempts;
  return Promise.reject(new Error('not implemented'));
}
