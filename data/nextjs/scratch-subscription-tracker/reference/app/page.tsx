'use client'
import { useState } from 'react'

interface Subscription {
  id: number
  name: string
  cost: number
  cycle: 'monthly' | 'yearly'
  category: string
}

const SEED: Subscription[] = [
  { id: 1, name: 'Netflix', cost: 15.99, cycle: 'monthly', category: 'Entertainment' },
  { id: 2, name: 'Spotify', cost: 9.99, cycle: 'monthly', category: 'Entertainment' },
  { id: 3, name: 'AWS', cost: 50.00, cycle: 'monthly', category: 'Productivity' },
  { id: 4, name: 'GitHub Pro', cost: 4.00, cycle: 'monthly', category: 'Productivity' },
  { id: 5, name: 'NYT', cost: 17.00, cycle: 'yearly', category: 'News' },
  { id: 6, name: 'iCloud', cost: 2.99, cycle: 'monthly', category: 'Storage' },
]

let nextId = 7

export default function App() {
  const [subs, setSubs] = useState<Subscription[]>(SEED.map(x => ({ ...x })))
  const [cycleFilter, setCycleFilter] = useState<string>('All')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')

  const [nameInput, setNameInput] = useState('')
  const [costInput, setCostInput] = useState('')
  const [cycleInput, setCycleInput] = useState<'monthly' | 'yearly'>('monthly')
  const [categoryInput, setCategoryInput] = useState('')

  const categories = Array.from(new Set(subs.map(s => s.category)))

  const filtered = subs.filter(s => {
    const matchCycle = cycleFilter === 'All' || s.cycle === cycleFilter
    const matchCat = categoryFilter === 'All' || s.category === categoryFilter
    return matchCycle && matchCat
  })

  const monthlyTotal = subs.filter(s => s.cycle === 'monthly').reduce((sum, s) => sum + s.cost, 0)
  const yearlyTotal = monthlyTotal * 12 + subs.filter(s => s.cycle === 'yearly').reduce((sum, s) => sum + s.cost, 0)

  function addSub() {
    if (!nameInput.trim()) return
    setSubs(xs => [...xs, {
      id: nextId++,
      name: nameInput.trim(),
      cost: parseFloat(costInput) || 0,
      cycle: cycleInput,
      category: categoryInput.trim(),
    }])
    setNameInput('')
    setCostInput('')
    setCycleInput('monthly')
    setCategoryInput('')
  }

  function cancelSub(id: number) {
    setSubs(xs => xs.filter(x => x.id !== id))
  }

  return (
    <div>
      <h1>Subscription Tracker</h1>

      <div>
        <select
          aria-label="Filter by cycle"
          value={cycleFilter}
          onChange={e => setCycleFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="monthly">monthly</option>
          <option value="yearly">yearly</option>
        </select>

        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <ul>
        {filtered.map(s => (
          <li key={s.id} data-testid="subscription-row">
            <span>{s.name}</span>
            <span>${s.cost.toFixed(2)}</span>
            <span>{s.cycle}</span>
            <span>{s.category}</span>
            <button onClick={() => cancelSub(s.id)}>Cancel</button>
          </li>
        ))}
      </ul>

      <div>
        <p data-testid="monthly-total">Monthly Total: ${monthlyTotal.toFixed(2)}</p>
        <p data-testid="yearly-total">Yearly Total: ${yearlyTotal.toFixed(2)}</p>
        <p data-testid="subscription-count">Subscriptions: {subs.length}</p>
      </div>

      <div>
        <h2>Add Subscription</h2>
        <input
          aria-label="Subscription Name"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          placeholder="Name"
        />
        <input
          aria-label="Cost"
          type="number"
          value={costInput}
          onChange={e => setCostInput(e.target.value)}
          placeholder="Cost"
        />
        <select
          aria-label="Billing Cycle"
          value={cycleInput}
          onChange={e => setCycleInput(e.target.value as 'monthly' | 'yearly')}
        >
          <option value="monthly">monthly</option>
          <option value="yearly">yearly</option>
        </select>
        <input
          aria-label="Category"
          value={categoryInput}
          onChange={e => setCategoryInput(e.target.value)}
          placeholder="Category"
        />
        <button onClick={addSub} disabled={!nameInput.trim()}>Add Subscription</button>
      </div>
    </div>
  )
}
