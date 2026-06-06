'use client'
import { useState } from 'react'

function fmt(n: number): string {
  return '$' + n.toFixed(2)
}

export default function App() {
  const [loanAmount, setLoanAmount] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [termYears, setTermYears] = useState('')

  const principal = parseFloat(loanAmount)
  const rate = parseFloat(annualRate)
  const years = parseInt(termYears, 10)

  let monthly = 0
  let totalPayment = 0
  let totalInterest = 0

  const valid =
    isFinite(principal) && principal > 0 &&
    isFinite(rate) && rate >= 0 &&
    isFinite(years) && years > 0

  if (valid) {
    const n = years * 12
    if (rate === 0) {
      monthly = principal / n
    } else {
      const r = rate / 100 / 12
      const factor = Math.pow(1 + r, n)
      monthly = principal * r * factor / (factor - 1)
    }
    totalPayment = monthly * years * 12
    totalInterest = totalPayment - principal
  }

  function reset() {
    setLoanAmount('')
    setAnnualRate('')
    setTermYears('')
  }

  return (
    <div>
      <h1>Loan Calculator</h1>

      <div>
        <label htmlFor="loan-amount">Loan Amount ($)</label>
        <input
          id="loan-amount"
          aria-label="Loan Amount"
          type="number"
          value={loanAmount}
          onChange={e => setLoanAmount(e.target.value)}
          min="0"
        />
      </div>

      <div>
        <label htmlFor="annual-rate">Annual Interest Rate (%)</label>
        <input
          id="annual-rate"
          aria-label="Annual Interest Rate"
          type="number"
          value={annualRate}
          onChange={e => setAnnualRate(e.target.value)}
          min="0"
        />
      </div>

      <div>
        <label htmlFor="term-years">Loan Term (years)</label>
        <input
          id="term-years"
          aria-label="Loan Term"
          type="number"
          value={termYears}
          onChange={e => setTermYears(e.target.value)}
          min="1"
        />
      </div>

      <div>
        <span>Monthly Payment:</span>
        <span data-testid="monthly-payment">{fmt(monthly)}</span>
      </div>
      <div>
        <span>Total Payment:</span>
        <span data-testid="total-payment">{fmt(totalPayment)}</span>
      </div>
      <div>
        <span>Total Interest:</span>
        <span data-testid="total-interest">{fmt(totalInterest)}</span>
      </div>

      <button onClick={reset}>Reset</button>
    </div>
  )
}
