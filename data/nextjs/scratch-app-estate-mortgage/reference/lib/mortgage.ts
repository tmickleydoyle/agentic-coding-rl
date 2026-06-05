import type { LoanInput } from './types'

// Standard amortized monthly payment. Principal = price - downPayment.
// monthlyRate r = (annualRatePct / 100) / 12, n = termYears * 12.
// M = P * r(1+r)^n / ((1+r)^n - 1); if r == 0, M = P / n. Result rounded to whole dollars.
export function monthlyPayment(input: LoanInput): number {
  const principal = Math.max(0, input.price - input.downPayment)
  const n = input.termYears * 12
  if (n <= 0) return 0
  const r = input.rate / 100 / 12
  if (r === 0) return Math.round(principal / n)
  const factor = Math.pow(1 + r, n)
  const m = (principal * r * factor) / (factor - 1)
  return Math.round(m)
}

export function totalInterest(input: LoanInput): number {
  const principal = Math.max(0, input.price - input.downPayment)
  const n = input.termYears * 12
  const monthly = monthlyPayment(input)
  return Math.max(0, Math.round(monthly * n - principal))
}
