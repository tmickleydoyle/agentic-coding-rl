export function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of arr) {
    const key = keyFn(item);
    const bucket = out[key];
    if (bucket) {
      bucket.push(item);
    } else {
      out[key] = [item];
    }
  }
  return out;
}
