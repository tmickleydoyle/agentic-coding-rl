'use client'
import { useState } from 'react'

interface Expense {
  id: number
  description: string
  category: string
  amount: number
}

const CATEGORIES = ['Food', 'Transport', 'Supplies', 'Entertainment', 'Other']

const SEED: Expense[] = [
  { id: 1, description: 'Coffee', category: 'Food', amount: 4.50 },
  { id: 2, description: 'Bus ticket', category: 'Transport', amount: 2.75 },
  { id: 3, description: 'Notebook', category: 'Supplies', amount: 8.99 },
]

let nextId = SEED.length + 1

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(SEED.map(x => ({ ...x })))
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Food')
  const [amount, setAmount] = useState('')
  const [filter, setFilter] = useState('All')

  function add() {
    const a = parseFloat(amount)
    if (!description.trim() || !isFinite(a) || a <= 0) return
    setExpenses(xs => [...xs, { id: nextId++, description: description.trim(), category, amount: a }])
    setDescription('')
    setCategory('Food')
    setAmount('')
  }

  function remove(id: number) {
    setExpenses(xs => xs.filter(x => x.id !== id))
  }

  const total = expenses.reduce((s, x) => s + x.amount, 0)
  const visible = filter === 'All' ? expenses : expenses.filter(x => x.category === filter)

  return (
    <div>
      <h1>Expense Tracker</h1>

      <div>
        <input
          aria-label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          aria-label="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button onClick={add}>Add Expense</button>
      </div>

      <div>
        <select
          aria-label="Filter by category"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <ul>
        {visible.map(x => (
          <li key={x.id} data-testid="expense-row">
            {x.description} | {x.category} | ${x.amount.toFixed(2)}
            <button onClick={() => remove(x.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <p data-testid="total">Total: ${total.toFixed(2)}</p>
    </div>
  )
}
