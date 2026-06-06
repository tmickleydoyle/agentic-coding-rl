'use client'
import { useState } from 'react'

interface InspirationItem {
  id: number
  title: string
  category: string
  notes: string
  pinned: boolean
}

const SEED: InspirationItem[] = [
  { id: 1, title: 'Brutalist Shapes', category: 'Design', notes: 'Bold geometry, raw concrete', pinned: true },
  { id: 2, title: 'Ocean Textures', category: 'Nature', notes: 'Wave patterns, tidal erosion', pinned: false },
  { id: 3, title: '70s Color Palettes', category: 'Color', notes: 'Muted earth tones, mustard', pinned: true },
  { id: 4, title: 'Street Typography', category: 'Type', notes: 'Hand-painted signs, worn edges', pinned: false },
]

export default function App() {
  const [items, setItems] = useState<InspirationItem[]>(SEED.map(x => ({ ...x })))
  const [filterText, setFilterText] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterPinned, setFilterPinned] = useState(false)

  const [inputTitle, setInputTitle] = useState('')
  const [inputCategory, setInputCategory] = useState('')
  const [inputNotes, setInputNotes] = useState('')
  const [inputPinned, setInputPinned] = useState(false)
  const [formError, setFormError] = useState(false)

  const nextId = () => Math.max(0, ...items.map(i => i.id)) + 1

  const categories = Array.from(new Set(items.map(i => i.category)))

  const filtered = items.filter(i => {
    const matchText = i.title.toLowerCase().includes(filterText.toLowerCase())
    const matchCat = filterCategory === 'All' ? true : i.category === filterCategory
    const matchPinned = filterPinned ? i.pinned : true
    return matchText && matchCat && matchPinned
  })

  const sorted = [
    ...filtered.filter(i => i.pinned),
    ...filtered.filter(i => !i.pinned),
  ]

  const pinnedCount = items.filter(i => i.pinned).length

  const handleTogglePin = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i))
  }

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputTitle.trim() || !inputCategory.trim()) {
      setFormError(true)
      return
    }
    setFormError(false)
    const newItem: InspirationItem = {
      id: nextId(),
      title: inputTitle.trim(),
      category: inputCategory.trim(),
      notes: inputNotes.trim(),
      pinned: inputPinned,
    }
    setItems(prev => [...prev, newItem])
    setInputTitle('')
    setInputCategory('')
    setInputNotes('')
    setInputPinned(false)
  }

  return (
    <div>
      <h1>Inspiration Board</h1>
      <span data-testid="item-count">{items.length} items</span>
      <span data-testid="pinned-count">{pinnedCount} pinned</span>

      <div>
        <input
          data-testid="filter-input"
          type="text"
          placeholder="Search by title"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
        <select
          data-testid="filter-category"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <label>
          <input
            data-testid="filter-pinned"
            type="checkbox"
            checked={filterPinned}
            onChange={e => setFilterPinned(e.target.checked)}
          />
          Pinned Only
        </label>
      </div>

      <div>
        {sorted.map(i => (
          <div key={i.id} data-testid="inspiration-card">
            <span data-testid="item-title">{i.title}</span>
            <span data-testid="item-category">{i.category}</span>
            <span data-testid="item-notes">{i.notes}</span>
            <span data-testid="item-pinned">{i.pinned ? 'Pinned' : 'Unpinned'}</span>
            <button
              data-testid="toggle-pin"
              onClick={() => handleTogglePin(i.id)}
            >
              {i.pinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              data-testid="delete-item"
              onClick={() => handleDelete(i.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input
          data-testid="input-title"
          type="text"
          placeholder="Title"
          value={inputTitle}
          onChange={e => setInputTitle(e.target.value)}
        />
        <input
          data-testid="input-category"
          type="text"
          placeholder="Category"
          value={inputCategory}
          onChange={e => setInputCategory(e.target.value)}
        />
        <input
          data-testid="input-notes"
          type="text"
          placeholder="Notes"
          value={inputNotes}
          onChange={e => setInputNotes(e.target.value)}
        />
        <label>
          <input
            data-testid="input-pinned"
            type="checkbox"
            checked={inputPinned}
            onChange={e => setInputPinned(e.target.checked)}
          />
          Pin this item
        </label>
        <button data-testid="submit-item" type="submit">Add Item</button>
        {formError && (
          <span data-testid="form-error">Title and category are required.</span>
        )}
      </form>
    </div>
  )
}
