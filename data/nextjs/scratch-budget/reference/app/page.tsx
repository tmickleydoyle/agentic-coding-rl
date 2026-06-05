'use client'
import { useState } from 'react'

type Tx = {
  id: number
  type: 'income' | 'expense'
  description: string
  category: string
  amount: number
  month: string
}

const BUDGETS = [
  { name: 'Food', limit: 300 },
  { name: 'Transport', limit: 100 },
  { name: 'Entertainment', limit: 150 },
]
const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Salary']
const MONTHS = ['January', 'February']

const SEED: Tx[] = [
  { id: 1, type: 'income', description: 'Salary', category: 'Salary', amount: 2000, month: 'January' },
  { id: 2, type: 'expense', description: 'Groceries', category: 'Food', amount: 120, month: 'January' },
  { id: 3, type: 'expense', description: 'Restaurant', category: 'Food', amount: 250, month: 'January' },
  { id: 4, type: 'expense', description: 'Bus pass', category: 'Transport', amount: 60, month: 'January' },
  { id: 5, type: 'expense', description: 'Movies', category: 'Entertainment', amount: 80, month: 'January' },
  { id: 6, type: 'income', description: 'Freelance', category: 'Salary', amount: 500, month: 'February' },
  { id: 7, type: 'expense', description: 'Snacks', category: 'Food', amount: 40, month: 'February' },
]

function money(n: number) {
  return `$${n.toFixed(2)}`
}

export default function App() {
  const [txs, setTxs] = useState<Tx[]>(SEED.map((t) => ({ ...t })))
  const [filter, setFilter] = useState('All')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Food')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState('January')
  const [nextId, setNextId] = useState(8)

  function add() {
    const a = parseFloat(amount)
    if (!isFinite(a) || a <= 0) return
    setTxs((xs) => [
      ...xs,
      { id: nextId, type, description: description.trim(), category, amount: a, month },
    ])
    setNextId((n) => n + 1)
    setDescription('')
    setAmount('')
  }

  const scope = filter === 'All' ? txs : txs.filter((t) => t.month === filter)
  const income = scope.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = scope.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense
  function spentIn(cat: string) {
    return scope
      .filter((t) => t.type === 'expense' && t.category === cat)
      .reduce((s, t) => s + t.amount, 0)
  }

  return (
    <div>
      <h1>Budget Tracker</h1>

      <select aria-label="Filter month" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        {MONTHS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <p>{`Balance: ${money(balance)}`}</p>

      <section aria-label="Budgets">
        {BUDGETS.map((b) => {
          const spent = spentIn(b.name)
          return (
            <div key={b.name}>
              <span>{`${b.name}: ${money(spent)} of ${money(b.limit)}`}</span>
              {spent > b.limit && <span>{`${b.name} over budget`}</span>}
            </div>
          )
        })}
      </section>

      <section aria-label="Transactions">
        <ul>
          {scope.map((t) => (
            <li key={t.id}>
              {`${t.description} (${t.category}, ${t.month}) ${t.type === 'expense' ? '-' : '+'}${money(t.amount)}`}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Add transaction">
        <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value as Tx['type'])}>
          <option value="income">income</option>
          <option value="expense">expense</option>
        </select>
        <input
          aria-label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          aria-label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select aria-label="Month" value={month} onChange={(e) => setMonth(e.target.value)}>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button onClick={add}>Add transaction</button>
      </section>
    </div>
  )
}
