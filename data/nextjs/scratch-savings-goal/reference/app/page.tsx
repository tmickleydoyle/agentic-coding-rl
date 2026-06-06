'use client'
import { useState } from 'react'

function fmt(n: number): string {
  return '$' + n.toFixed(2)
}

export default function App() {
  const [goalAmount, setGoalAmount] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContrib, setMonthlyContrib] = useState('')
  const [annualRate, setAnnualRate] = useState('')

  const goal = parseFloat(goalAmount)
  const current = parseFloat(currentSavings) || 0
  const monthly = parseFloat(monthlyContrib)
  const rate = parseFloat(annualRate) || 0

  const validGoal = isFinite(goal) && goal > 0
  const validMonthly = isFinite(monthly) && monthly > 0

  let monthsToGoal: number | null = null
  let totalContributed = 0
  let totalInterest = 0
  let finalAmount = 0
  let overLimit = false

  if (validGoal && validMonthly) {
    const r = rate / 100 / 12
    let balance = current
    let months = 0

    if (balance >= goal) {
      months = 0
      totalContributed = current
      totalInterest = 0
      finalAmount = current
    } else {
      while (balance < goal && months < 1200) {
        balance = balance * (1 + r) + monthly
        months++
      }
      if (balance < goal) {
        overLimit = true
      } else {
        monthsToGoal = months
        totalContributed = current + monthly * months
        finalAmount = balance
        totalInterest = finalAmount - totalContributed
      }
    }
    if (!overLimit && months === 0) {
      monthsToGoal = 0
    }
  }

  function reset() {
    setGoalAmount('')
    setCurrentSavings('')
    setMonthlyContrib('')
    setAnnualRate('')
  }

  const monthsDisplay = overLimit
    ? '>1200'
    : monthsToGoal !== null
    ? String(monthsToGoal)
    : '--'

  return (
    <div>
      <h1>Savings Goal Calculator</h1>

      <div>
        <label htmlFor="goal">Goal Amount ($)</label>
        <input
          id="goal"
          aria-label="Goal Amount"
          type="number"
          value={goalAmount}
          onChange={e => setGoalAmount(e.target.value)}
          min="0"
        />
      </div>

      <div>
        <label htmlFor="current">Current Savings ($)</label>
        <input
          id="current"
          aria-label="Current Savings"
          type="number"
          value={currentSavings}
          onChange={e => setCurrentSavings(e.target.value)}
          min="0"
        />
      </div>

      <div>
        <label htmlFor="monthly">Monthly Contribution ($)</label>
        <input
          id="monthly"
          aria-label="Monthly Contribution"
          type="number"
          value={monthlyContrib}
          onChange={e => setMonthlyContrib(e.target.value)}
          min="0"
        />
      </div>

      <div>
        <label htmlFor="rate">Annual Interest Rate (%)</label>
        <input
          id="rate"
          aria-label="Annual Interest Rate"
          type="number"
          value={annualRate}
          onChange={e => setAnnualRate(e.target.value)}
          min="0"
        />
      </div>

      <div>
        <span>Months to Goal:</span>
        <span data-testid="months-to-goal">{monthsDisplay}</span>
      </div>
      <div>
        <span>Total Contributed:</span>
        <span data-testid="total-contributed">{validGoal && validMonthly ? fmt(totalContributed) : '$0.00'}</span>
      </div>
      <div>
        <span>Total Interest:</span>
        <span data-testid="total-interest">{validGoal && validMonthly ? fmt(totalInterest) : '$0.00'}</span>
      </div>
      <div>
        <span>Final Amount:</span>
        <span data-testid="final-amount">{validGoal && validMonthly ? fmt(finalAmount) : '$0.00'}</span>
      </div>

      <button onClick={reset}>Reset</button>
    </div>
  )
}
