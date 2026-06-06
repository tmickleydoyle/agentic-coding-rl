'use client'
import { useState } from 'react'

const STATUSES = ['Want to Read', 'Reading', 'Read']

interface Book {
  id: number
  title: string
  author: string
  status: string
  rating: number
}

const SEED: Book[] = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', status: 'Read', rating: 4 },
  { id: 2, title: 'Dune', author: 'Frank Herbert', status: 'Reading', rating: 0 },
  { id: 3, title: 'Project Hail Mary', author: 'Andy Weir', status: 'Read', rating: 5 },
  { id: 4, title: 'Atomic Habits', author: 'James Clear', status: 'Want to Read', rating: 0 },
]

export default function App() {
  const [books, setBooks] = useState<Book[]>(SEED.map(b => ({ ...b })))
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState('Want to Read')
  const [rating, setRating] = useState('0')
  const [filter, setFilter] = useState('All')
  const [nextId, setNextId] = useState(SEED.length + 1)

  const filtered = filter === 'All' ? books : books.filter(b => b.status === filter)

  const ratedBooks = books.filter(b => b.rating > 0)
  const avgRating = ratedBooks.length === 0
    ? 'N/A'
    : (Math.round((ratedBooks.reduce((s, b) => s + b.rating, 0) / ratedBooks.length) * 10) / 10).toFixed(1)

  function handleAdd() {
    if (!title.trim() || !author.trim()) return
    const r = parseInt(rating, 10)
    if (!isFinite(r) || r < 0 || r > 5) return
    setBooks(prev => [...prev, { id: nextId, title: title.trim(), author: author.trim(), status, rating: r }])
    setNextId(n => n + 1)
    setTitle('')
    setAuthor('')
    setStatus('Want to Read')
    setRating('0')
  }

  function handleRemove(id: number) {
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div>
      <h1>Book Tracker</h1>
      <label>
        Filter by status
        <select aria-label="Filter by status" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <p data-testid="book-count">{filtered.length} books</p>
      <p data-testid="avg-rating">Avg rating: {avgRating}</p>
      <ul>
        {filtered.map(b => (
          <li key={b.id} data-testid="book-item">
            {b.title} by {b.author} | {b.status} | Rating: {b.rating}/5
            <button data-testid="remove-btn" onClick={() => handleRemove(b.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <label>
          Title
          <input aria-label="Title" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          Author
          <input aria-label="Author" value={author} onChange={e => setAuthor(e.target.value)} />
        </label>
        <label>
          Status
          <select aria-label="Status" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Rating
          <input type="number" aria-label="Rating" value={rating} min={0} max={5} onChange={e => setRating(e.target.value)} />
        </label>
        <button onClick={handleAdd}>Add Book</button>
      </div>
    </div>
  )
}
