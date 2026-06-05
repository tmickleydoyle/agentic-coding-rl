'use client'
import { useState } from 'react'
import { useExpenses } from '../../components/ExpensesProvider'
import type { Category } from '../../lib/types'
import { CATEGORIES } from '../../lib/types'

export default function AddPage() {
  const { trips, selectedTripId, addExpense, navigate } = useExpenses()
  const [tripId, setTripId] = useState(selectedTripId ?? trips[0]?.id ?? '')
  const [day, setDay] = useState('1')
  const [category, setCategory] = useState<Category>('food')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = Number.parseFloat(amount)
    if (Number.isNaN(amt) || amt <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    setError('')
    const dayNum = Number.parseInt(day, 10)
    addExpense({
      tripId,
      day: Number.isNaN(dayNum) || dayNum < 1 ? 1 : dayNum,
      category,
      amount: amt,
      note: note.trim(),
    })
    setAmount('')
    setNote('')
    navigate('expenses')
  }

  return (
    <section data-testid="page-add">
      <h1>Add expense</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <label htmlFor="trip">Trip</label>
        <select
          id="trip"
          data-testid="trip-select"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
        >
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <label htmlFor="day">Day</label>
        <input
          id="day"
          type="number"
          data-testid="day-input"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          data-testid="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          data-testid="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label htmlFor="note">Note</label>
        <input
          id="note"
          data-testid="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-expense">
          Add
        </button>
      </form>
    </section>
  )
}
