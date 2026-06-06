'use client'
import { useState } from 'react'

type Category = 'Fuel' | 'Maintenance' | 'Insurance' | 'Registration' | 'Other'

interface Expense {
  id: number
  date: string
  category: Category
  amount: number
  description: string
}

const CATEGORIES: Category[] = ['Fuel', 'Maintenance', 'Insurance', 'Registration', 'Other']

const SEED: Expense[] = [
  { id: 1, date: '2024-01-08', category: 'Fuel', amount: 45.00, description: 'Gas fill-up' },
  { id: 2, date: '2024-01-15', category: 'Maintenance', amount: 120.00, description: 'Oil change' },
  { id: 3, date: '2024-02-03', category: 'Insurance', amount: 95.00, description: 'Monthly premium' },
  { id: 4, date: '2024-02-10', category: 'Fuel', amount: 42.50, description: 'Gas fill-up' },
]

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(SEED.map(e => ({ ...e })))
  const [date, setDate] = useState('')
  const [category, setCategory] = useState<Category>('Fuel')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [nextId, setNextId] = useState(5)

  const handleAdd = () => {
    if (!date || !amount || !description.trim() || Number(amount) <= 0) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    setExpenses(prev => [...prev, { id: nextId, date, category, amount: Number(amount), description: description.trim() }])
    setNextId(n => n + 1)
    setDate('')
    setAmount('')
    setDescription('')
    setCategory('Fuel')
  }

  const handleDelete = (id: number) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
    if (editingId === id) setEditingId(null)
  }

  const handleEdit = (id: number, currentAmount: number) => {
    setEditingId(id)
    setEditValue(String(currentAmount))
  }

  const handleSave = (id: number) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, amount: Number(editValue) } : e))
    setEditingId(null)
  }

  const filtered = categoryFilter === 'All'
    ? expenses
    : expenses.filter(e => e.category === categoryFilter)

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryTotals: Record<string, number> = {}
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
  })

  return (
    <div>
      <h1>Car Expenses</h1>

      <div>
        <h2>Add Expense</h2>
        {error && <p data-testid="error-msg">{error}</p>}
        <div>
          <label htmlFor="date-input">Date</label>
          <input
            id="date-input"
            data-testid="date-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="category-select">Category</label>
          <select
            id="category-select"
            data-testid="category-select"
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="amount-input">Amount ($)</label>
          <input
            id="amount-input"
            data-testid="amount-input"
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description-input">Description</label>
          <input
            id="description-input"
            data-testid="description-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button data-testid="add-btn" onClick={handleAdd}>Add Expense</button>
      </div>

      <div>
        <h2>Summary</h2>
        <p>Total Expenses: <span data-testid="total-expenses">{expenses.length}</span></p>
        <p>Total Amount: <span data-testid="total-amount">${totalAmount.toFixed(2)}</span></p>
        <ul>
          {CATEGORIES.map(c => categoryTotals[c] != null ? (
            <li key={c}>
              {c}: <span data-testid={`category-${c}`}>${categoryTotals[c].toFixed(2)}</span>
            </li>
          ) : null)}
        </ul>
      </div>

      <div>
        <label htmlFor="category-filter">Filter by Category</label>
        <select
          id="category-filter"
          data-testid="category-filter"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="All">All</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(e => (
            <tr key={e.id} data-testid="expense-row">
              <td>{e.date}</td>
              <td>{e.category}</td>
              <td data-testid={`amount-${e.id}`}>
                {editingId === e.id ? (
                  <>
                    <input
                      data-testid={`edit-input-${e.id}`}
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={ev => setEditValue(ev.target.value)}
                    />
                    <button data-testid={`save-btn-${e.id}`} onClick={() => handleSave(e.id)}>Save</button>
                  </>
                ) : (
                  `$${e.amount.toFixed(2)}`
                )}
              </td>
              <td>{e.description}</td>
              <td>
                {editingId !== e.id && (
                  <button data-testid={`edit-btn-${e.id}`} onClick={() => handleEdit(e.id, e.amount)}>Edit</button>
                )}
                <button data-testid={`delete-btn-${e.id}`} onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
