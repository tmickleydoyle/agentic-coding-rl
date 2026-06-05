'use client'
import { useState } from 'react'
import { useWater } from '../../components/WaterProvider'
import { useIntake } from '../../hooks/useIntake'
import DrinkRow from '../../components/DrinkRow'

const QUICK = [250, 500]

export default function TodayPage() {
  const { goal, addDrink, removeDrink } = useWater()
  const { todayDrinks, todayTotal, percent, remaining, met } = useIntake()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(amount)
    if (amount.trim().length === 0 || Number.isNaN(n) || n <= 0) {
      setError('Enter a valid amount')
      return
    }
    setError('')
    addDrink({ amount: n })
    setAmount('')
  }

  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <p data-testid="today-total">{todayTotal}</p>
      <p data-testid="today-goal">{goal}</p>
      <p data-testid="today-percent">{percent}</p>
      <p data-testid="today-remaining">{remaining}</p>
      <p data-testid="today-met" data-met={met ? 'true' : 'false'}>
        {met ? 'Goal met' : 'Drink up'}
      </p>
      <div data-testid="quick-add">
        {QUICK.map((q) => (
          <button
            key={q}
            data-testid={`quick-${q}`}
            onClick={() => addDrink({ amount: q })}
          >
            +{q}
          </button>
        ))}
      </div>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <input
          data-testid="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-drink">
          Add drink
        </button>
      </form>
      {todayDrinks.length === 0 ? (
        <p data-testid="empty-state">No drinks logged today.</p>
      ) : (
        <ul data-testid="drink-list">
          {todayDrinks.map((d) => (
            <DrinkRow key={d.id} drink={d} onRemove={removeDrink} />
          ))}
        </ul>
      )}
    </section>
  )
}
