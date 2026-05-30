'use client'
import { useState } from 'react'
import { useBudget } from '../../components/BudgetProvider'

export default function AddExpensePage() {
  const { categories, addExpense, navigate } = useBudget()
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount)
    if (amount.trim().length === 0 || Number.isNaN(parsed) || parsed <= 0) {
      setError('Enter a positive amount')
      return
    }
    setError('')
    addExpense({ categoryId, amount: parsed, note: note.trim() })
    setAmount('')
    setNote('')
    navigate('overview')
  }

  return (
    <section data-testid="page-add-expense">
      <h1>Add expense</h1>
      <form data-testid="expense-form" onSubmit={onSubmit}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          data-testid="category-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
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
          Add expense
        </button>
      </form>
    </section>
  )
}
