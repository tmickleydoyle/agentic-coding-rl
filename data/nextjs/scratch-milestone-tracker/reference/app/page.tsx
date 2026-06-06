'use client'
import { useState } from 'react'

interface Milestone {
  id: number
  title: string
  targetDate: string
  category: string
  completed: boolean
  notes: string
}

const CATEGORIES = ['personal', 'career', 'learning', 'fitness', 'other']

const SEED: Milestone[] = [
  { id: 1, title: 'Learn TypeScript', targetDate: '2024-03-31', category: 'learning', completed: true, notes: 'Finished the complete course' },
  { id: 2, title: 'Run a 5K', targetDate: '2024-06-15', category: 'fitness', completed: true, notes: 'Did it in under 30 minutes' },
  { id: 3, title: 'Read 12 books', targetDate: '2024-12-31', category: 'personal', completed: false, notes: 'Currently on book 8' },
  { id: 4, title: 'Launch side project', targetDate: '2025-02-28', category: 'career', completed: false, notes: 'MVP in progress' },
]

type Filter = 'all' | 'completed' | 'progress'

export default function App() {
  const [milestones, setMilestones] = useState<Milestone[]>(SEED.map(m => ({ ...m })))
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [category, setCategory] = useState('personal')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [nextId, setNextId] = useState(5)

  function handleAdd() {
    if (!title.trim() || !targetDate.trim()) {
      setError('Title and target date are required')
      return
    }
    setError('')
    setMilestones(prev => [...prev, { id: nextId, title: title.trim(), targetDate, category, completed: false, notes: notes.trim() }])
    setNextId(n => n + 1)
    setTitle('')
    setTargetDate('')
    setCategory('personal')
    setNotes('')
  }

  function handleDelete(id: number) {
    setMilestones(prev => prev.filter(m => m.id !== id))
  }

  function handleToggle(id: number) {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m))
  }

  const filtered = milestones.filter(m => {
    if (filter === 'completed') return m.completed
    if (filter === 'progress') return !m.completed
    return true
  })

  const completedCount = milestones.filter(m => m.completed).length
  const totalCount = milestones.length

  return (
    <div>
      <h1>Milestone Tracker</h1>
      <p data-testid="stats">{completedCount} / {totalCount} completed</p>

      <div>
        <button data-testid="filter-all" onClick={() => setFilter('all')}>All</button>
        <button data-testid="filter-completed" onClick={() => setFilter('completed')}>Completed</button>
        <button data-testid="filter-progress" onClick={() => setFilter('progress')}>In Progress</button>
      </div>

      {filtered.length === 0 ? (
        <p data-testid="empty-state">No milestones found</p>
      ) : (
        <div>
          {filtered.map(milestone => (
            <div key={milestone.id} data-testid="milestone-card">
              <h2 data-testid={milestone.completed ? 'completed-title' : 'milestone-title'}>{milestone.title}</h2>
              <p data-testid="milestone-date">{milestone.targetDate}</p>
              <span data-testid="category-badge">{milestone.category}</span>
              <p data-testid="milestone-notes">{milestone.notes}</p>
              <input
                data-testid="complete-checkbox"
                type="checkbox"
                checked={milestone.completed}
                onChange={() => handleToggle(milestone.id)}
              />
              <button data-testid="delete-btn" onClick={() => handleDelete(milestone.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <div data-testid="add-form">
        <h2>Add Milestone</h2>
        {error && <p data-testid="form-error">{error}</p>}
        <label>
          Title
          <input data-testid="input-title" type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          Target Date
          <input data-testid="input-target-date" type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
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
        <button data-testid="add-btn" onClick={handleAdd}>Add Milestone</button>
      </div>
    </div>
  )
}
