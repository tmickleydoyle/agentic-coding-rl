'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Expenses() {
  const { expenses, addExpense, deleteExpense } = useApp()
  const [vendor, setVendor] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [filter, setFilter] = useState('')

  function handleAdd() {
    const parsed = parseFloat(amount)
    addExpense(vendor, category, parsed)
    setVendor('')
    setCategory('')
    setAmount('')
  }

  const filtered = filter.trim()
    ? expenses.filter((e) => e.category.toLowerCase() === filter.trim().toLowerCase())
    : expenses

  const filteredTotal = filtered.reduce((sum, e) => sum + e.amount, 0)

  return (
    <section aria-label="Expenses view">
      <h1>Expenses</h1>
      <div>
        <input
          aria-label="Vendor"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        />
        <input
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          aria-label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleAdd}>Add expense</button>
      </div>
      <div>
        <input
          aria-label="Filter by category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ul>
        {filtered.map((e) => (
          <li key={e.id}>
            <span>{e.vendor}</span>
            <span>{e.category}</span>
            <span>{fmt(e.amount)}</span>
            <button aria-label={`Delete ${e.vendor}`} onClick={() => deleteExpense(e.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>{`Filtered total: ${fmt(filteredTotal)}`}</p>
    </section>
  )
}
