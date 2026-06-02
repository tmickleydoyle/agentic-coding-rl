'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Expenses() {
  const { expenses, addExpense, deleteExpense } = useApp()
  const [vendor, setVendor] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [filter, setFilter] = useState('All')

  // collect unique categories in first-appearance order
  const categories: string[] = []
  expenses.forEach((e) => {
    if (!categories.includes(e.category)) categories.push(e.category)
  })

  // if the current filter no longer exists, fall back to All
  const activeFilter = categories.includes(filter) ? filter : 'All'

  const visible = activeFilter === 'All' ? expenses : expenses.filter((e) => e.category === activeFilter)
  const filteredTotal = visible.reduce((s, e) => s + e.amount, 0)

  function handleAdd() {
    const parsed = parseFloat(amount)
    addExpense(vendor, category, parsed)
    setVendor('')
    setCategory('')
    setAmount('')
  }

  return (
    <section aria-label="Expenses view">
      <h1>Expenses</h1>
      <input aria-label="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
      <input aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input aria-label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleAdd}>Add Expense</button>

      <label>
        Filter by category
        <select
          aria-label="Filter by category"
          value={activeFilter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <ul>
        {visible.map((e) => (
          <li key={e.id}>
            <span>{e.vendor}</span>
            <span>{e.category}</span>
            <span>{fmt(e.amount)}</span>
            <button aria-label={`Delete ${e.vendor}`} onClick={() => deleteExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <p>{`Filtered Total: ${fmt(filteredTotal)}`}</p>
    </section>
  )
}
