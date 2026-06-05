'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'

const CATEGORIES: Category[] = ['Food', 'Travel', 'Supplies', 'Software', 'Other']

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

export function Expenses() {
  const { expenses, addExpense } = useApp()
  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Food')
  const [filter, setFilter] = useState<'All' | Category>('All')

  const visible = filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)
  const filteredTotal = visible.reduce((s, e) => s + e.amount, 0)

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
          aria-label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addExpense(vendor, category, amount)
            setVendor('')
            setAmount('')
          }}
        >
          Add Expense
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by category"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | Category)}
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <p>{`Filtered Total: ${fmt(filteredTotal)}`}</p>
      <ul>
        {visible.map((e) => (
          <li key={e.id}>
            <span>{e.vendor}</span>
            <span>{e.category}</span>
            <span>{fmt(e.amount)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
