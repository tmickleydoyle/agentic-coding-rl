'use client'
import { useState } from 'react'

interface Entry {
  id: number
  title: string
  date: string
  category: string
  content: string
}

const CATEGORIES = ['personal', 'career', 'health', 'travel', 'other']

const SEED: Entry[] = [
  { id: 1, title: 'Started new job', date: '2024-01-15', category: 'career', content: 'First day at the new company. Everyone was welcoming.' },
  { id: 2, title: 'Adopted a dog', date: '2024-03-02', category: 'personal', content: 'Brought home a golden retriever puppy named Biscuit.' },
  { id: 3, title: 'Completed marathon', date: '2024-05-19', category: 'health', content: 'Finished in 4 hours 12 minutes. Couldn\'t believe it.' },
  { id: 4, title: 'Moved to new apartment', date: '2024-09-01', category: 'personal', content: 'Finally have my own space in a great neighborhood.' },
]

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(SEED.map(e => ({ ...e })))
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('personal')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [nextId, setNextId] = useState(5)

  function handleAdd() {
    if (!title.trim() || !date.trim() || !content.trim()) {
      setError('Title, date, and content are required')
      return
    }
    setError('')
    setEntries(prev => [...prev, { id: nextId, title: title.trim(), date, category, content: content.trim() }])
    setNextId(n => n + 1)
    setTitle('')
    setDate('')
    setCategory('personal')
    setContent('')
  }

  function handleDelete(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const filtered = categoryFilter ? entries.filter(e => e.category === categoryFilter) : entries
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <h1>Timeline Journal</h1>
      <p data-testid="entry-count">{sorted.length} entries</p>

      <label>
        Filter by Category
        <select data-testid="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      {sorted.length === 0 ? (
        <p data-testid="empty-state">No entries yet</p>
      ) : (
        <div>
          {sorted.map(entry => (
            <div key={entry.id} data-testid="entry-card">
              <h2 data-testid="entry-title">{entry.title}</h2>
              <p data-testid="entry-date">{entry.date}</p>
              <span data-testid="category-badge">{entry.category}</span>
              <p data-testid="entry-content">{entry.content}</p>
              <button data-testid="delete-btn" onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <div data-testid="add-form">
        <h2>Add Entry</h2>
        {error && <p data-testid="form-error">{error}</p>}
        <label>
          Title
          <input data-testid="input-title" type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          Date
          <input data-testid="input-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Category
          <select data-testid="input-category" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Content
          <textarea data-testid="input-content" value={content} onChange={e => setContent(e.target.value)} />
        </label>
        <button data-testid="add-btn" onClick={handleAdd}>Add Entry</button>
      </div>
    </div>
  )
}
