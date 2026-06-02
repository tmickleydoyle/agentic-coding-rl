export function formatDollars(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('en-US')
}
