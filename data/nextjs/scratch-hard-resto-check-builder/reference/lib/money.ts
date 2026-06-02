// Round a dollar amount to the nearest cent and format with two decimals.
export function money(n: number): string {
  const cents = Math.round(n * 100)
  return `$${(cents / 100).toFixed(2)}`
}
