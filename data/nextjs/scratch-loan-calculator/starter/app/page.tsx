'use client'
import { useState } from 'react'

export default function App() {
  const [loanAmount, setLoanAmount] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [termYears, setTermYears] = useState('')

  return (
    <div>
      <h1>Loan Calculator</h1>
      <div data-testid="monthly-payment">$0.00</div>
      <div data-testid="total-payment">$0.00</div>
      <div data-testid="total-interest">$0.00</div>
    </div>
  )
}
