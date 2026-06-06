'use client'
import { useState } from 'react'

interface Anniversary {
  id: number
  title: string
  originalDate: string
  category: string
  notes: string
}

const CATEGORIES = ['relationship', 'career', 'personal', 'health', 'other']

const TODAY = '2024-12-01'

const SEED: Anniversary[] = [
  { id: 1, title: 'Wedding Anniversary', originalDate: '2018-09-14', category: 'relationship', notes: 'Married in the botanical garden' },
  { id: 2, title: 'Work Start Date', originalDate: '2020-03-01', category: 'career', notes: 'First day at current company' },
  { id: 3, title: 'Moved to City', originalDate: '2019-06-20', category: 'personal', notes: 'Big move from the suburbs' },
  { id: 4, title: "Dog's Birthday", originalDate: '2021-11-05', category: 'personal', notes: "Biscuit's first birthday was epic" },
]

function getYearsElapsed(originalDate: string): number {
  const orig = new Date(originalDate)
  const today = new Date(TODAY)
  let years = today.getFullYear() - orig.getFullYear()
  const monthDiff = today.getMonth() - orig.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < orig.getDate())) {
    years--
  }
  return years
}

function getNextAnniversary(originalDate: string): Date {
  const orig = new Date(originalDate)
  const today = new Date(TODAY)
  const thisYear = today.getFullYear()
  const candidate = new Date(thisYear, orig.getMonth(), orig.getDate())
  if (candidate < today) {
    return new Date(thisYear + 1, orig.getMonth(), orig.getDate())
  }
  return candidate
}

function getDaysUntil(originalDate: string): number | null {
  const next = getNextAnniversary(originalDate)
  const today = new Date(TODAY)
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((next.getTime() - today.getTime()) / msPerDay)
}

export default function App() {
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>(SEED.map(a => ({ ...a })))
  const [title, setTitle] = useState('')
  const [originalDate, setOriginalDate] = useState('')
  const [category, setCategory] = useState('personal')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [nextId, setNextId] = useState(5)

  function handleAdd() {
    if (!title.trim() || !originalDate.trim()) {
      setError('Title and date are required')
      return
    }
    setError('')
    setAnniversaries(prev => [...prev, { id: nextId, title: title.trim(), originalDate, category, notes: notes.trim() }])
    setNextId(n => n + 1)
    setTitle('')
    setOriginalDate('')
    setCategory('personal')
    setNotes('')
  }

  function handleDelete(id: number) {
    setAnniversaries(prev => prev.filter(a => a.id !== id))
  }

  const filtered = categoryFilter ? anniversaries.filter(a => a.category === categoryFilter) : anniversaries

  return (
    <div>
      <h1>Anniversary Log</h1>
      <p data-testid="anniversary-count">{filtered.length} anniversaries</p>

      <label>
        Filter by Category
        <select data-testid="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      {filtered.length === 0 ? (
        <p data-testid="empty-state">No anniversaries found</p>
      ) : (
        <div>
          {filtered.map(ann => {
            const days = getDaysUntil(ann.originalDate)
            const years = getYearsElapsed(ann.originalDate)
            return (
              <div key={ann.id} data-testid="anniversary-card">
                <h2 data-testid="anniversary-title">{ann.title}</h2>
                <p data-testid="anniversary-original-date">{ann.originalDate}</p>
                <span data-testid="category-badge">{ann.category}</span>
                <p data-testid="anniversary-notes">{ann.notes}</p>
                <p data-testid="years-elapsed">{years} years</p>
                <p data-testid="days-until">{days === 0 ? 'Today!' : `${days} days`}</p>
                <button data-testid="delete-btn" onClick={() => handleDelete(ann.id)}>Delete</button>
              </div>
            )
          })}
        </div>
      )}

      <div data-testid="add-form">
        <h2>Add Anniversary</h2>
        {error && <p data-testid="form-error">{error}</p>}
        <label>
          Title
          <input data-testid="input-title" type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          Original Date
          <input data-testid="input-original-date" type="date" value={originalDate} onChange={e => setOriginalDate(e.target.value)} />
        </label>
        <label>
          Category
          <select data-testid="input-category" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Notes
          <input data-testid="input-notes" type="text" value={notes} onChange={e => setNotes(e.target.value)} />
        </label>
        <button data-testid="add-btn" onClick={handleAdd}>Add Anniversary</button>
      </div>
    </div>
  )
}
