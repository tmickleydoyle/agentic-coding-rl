'use client'
import { useState } from 'react'

interface Book {
  id: number
  title: string
  author: string
  rating: number
  notes: string
}

const SEED: Book[] = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', rating: 4, notes: 'Vivid portrayal of the Jazz Age.' },
  { id: 2, title: '1984', author: 'George Orwell', rating: 5, notes: 'Chilling dystopia, still relevant.' },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', rating: 5, notes: 'Profound story of justice and compassion.' },
]

function clampRating(r: number): number {
  if (r < 1) return 1
  if (r > 5) return 5
  return Math.round(r)
}

export default function App() {
  const [books, setBooks] = useState<Book[]>(SEED.map(b => ({ ...b })))
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState('')
  const [notes, setNotes] = useState('')
  const [nextId, setNextId] = useState(4)

  function addBook() {
    if (!title.trim() || !author.trim()) return
    const r = clampRating(Number(rating) || 1)
    setBooks(bs => [...bs, { id: nextId, title: title.trim(), author: author.trim(), rating: r, notes: notes.trim() }])
    setNextId(n => n + 1)
    setTitle('')
    setAuthor('')
    setRating('')
    setNotes('')
  }

  function deleteBook(id: number) {
    setBooks(bs => bs.filter(b => b.id !== id))
  }

  const avgRating = books.length === 0
    ? '0.0'
    : (books.reduce((s, b) => s + b.rating, 0) / books.length).toFixed(1)

  return (
    <div>
      <h1>Book Notes</h1>

      <div>
        <input
          aria-label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          aria-label="Author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <input
          aria-label="Rating"
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={e => setRating(e.target.value)}
        />
        <textarea
          aria-label="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>
      </div>

      <ul>
        {books.map(b => (
          <li key={b.id} data-testid="book-item">
            <span data-testid="book-title">{b.title}</span>
            <span data-testid="book-author">{b.author}</span>
            <span data-testid="book-rating">Rating: {b.rating}</span>
            <span data-testid="book-notes">{b.notes}</span>
            <button onClick={() => deleteBook(b.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <p data-testid="book-count">Books: {books.length}</p>
      <p data-testid="avg-rating">Avg Rating: {avgRating}</p>
    </div>
  )
}
