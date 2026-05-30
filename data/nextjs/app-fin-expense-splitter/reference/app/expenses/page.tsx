'use client'
import { useState } from 'react'
import { useSplit } from '../../components/SplitProvider'
import ExpenseItem from '../../components/ExpenseItem'

export default function ExpensesPage() {
  const { people, expenses, addExpense, removeExpense } = useSplit()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(people[0]?.id ?? '')
  const [error, setError] = useState('')

  const payerName = (id: string): string =>
    people.find((p) => p.id === id)?.name ?? 'Unknown'

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount)
    if (description.trim().length === 0) {
      setError('Description is required')
      return
    }
    if (amount.trim().length === 0 || Number.isNaN(parsed) || parsed <= 0) {
      setError('Enter a positive amount')
      return
    }
    setError('')
    addExpense({ description: description.trim(), amount: parsed, paidBy })
    setDescription('')
    setAmount('')
  }

  return (
    <section data-testid="page-expenses">
      <h1>Expenses</h1>
      <form data-testid="expense-form" onSubmit={onSubmit}>
        <input
          data-testid="description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          data-testid="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          data-testid="payer-select"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
        >
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-expense">
          Add expense
        </button>
      </form>
      {expenses.length === 0 ? (
        <p data-testid="empty-expenses">No expenses yet.</p>
      ) : (
        <ul data-testid="expense-list">
          {expenses.map((ex) => (
            <ExpenseItem
              key={ex.id}
              expense={ex}
              payerName={payerName(ex.paidBy)}
              onRemove={removeExpense}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
