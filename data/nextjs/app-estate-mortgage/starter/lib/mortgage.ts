import type { LoanInput } from './types'

// Standard amortized monthly payment. Principal = price - downPayment.
// monthlyRate r = (annualRatePct / 100) / 12, n = termYears * 12.
// M = P * r(1+r)^n / ((1+r)^n - 1); if r == 0, M = P / n. Round to whole dollars.
export function monthlyPayment(_input: LoanInput): number {
  // TODO: implement the amortized monthly payment
  return 0
}

export function totalInterest(_input: LoanInput): number {
  // TODO: max(0, round(monthly * n - principal))
  return 0
}
