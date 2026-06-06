'use client'
import { useState } from 'react'

export default function App() {
  const [goalAmount, setGoalAmount] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContrib, setMonthlyContrib] = useState('')
  const [annualRate, setAnnualRate] = useState('')

  return (
    <div>
      <h1>Savings Goal Calculator</h1>
      <div data-testid="months-to-goal">--</div>
      <div data-testid="total-contributed">$0.00</div>
      <div data-testid="total-interest">$0.00</div>
      <div data-testid="final-amount">$0.00</div>
    </div>
  )
}
