'use client'
import { useState } from 'react'

type Status = 'Want to read' | 'Reading' | 'Finished'

type Book = {
  id: number
  title: string
  status: Status
}

const STATUSES: Status[] = ['Want to read', 'Reading', 'Finished']
const FILTERS = ['All', 'Want to read', 'Reading', 'Finished'] as const
type Filter = typeof FILTERS[number]

export default function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [title, setTitle] = useState('')
  const [nextId, setNextId] = useState(1)
  const [filter, setFilter] = useState<Filter>('All')

  function addBook() {
    const t = title.trim()
    if (!t) return
    setBooks(bs => [...bs, { id: nextId, title: t, status: 'Want to read' }])
    setNextId(n => n + 1)
    setTitle('')
  }

  function removeBook(id: number) {
    setBooks(bs => bs.filter(b => b.id !== id))
  }

  function changeStatus(id: number, status: Status) {
    setBooks(bs => bs.map(b => b.id === id ? { ...b, status } : b))
  }

  const total = books.length
  const wantCount = books.filter(b => b.status === 'Want to read').length
  const readingCount = books.filter(b => b.status === 'Reading').length
  const finishedCount = books.filter(b => b.status === 'Finished').length
  const finishedPct = total > 0 ? Math.floor((finishedCount / total) * 100) : 0

  const visibleBooks = filter === 'All' ? books : books.filter(b => b.status === filter)

  return (
    <div>
      <h1>Reading List</h1>
      <div>
        <input
          aria-label="Book title"
          placeholder="Book title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button onClick={addBook}>Add book</button>
      </div>
      <div>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <p>{`Total: ${total} | Want to read: ${wantCount} | Reading: ${readingCount} | Finished: ${finishedCount}`}</p>
      <p>{`Finished: ${finishedPct}%`}</p>
      <ul>
        {visibleBooks.map(b => (
          <li key={b.id}>
            <span>{b.title}</span>
            <select
              aria-label={b.title}
              value={b.status}
              onChange={e => changeStatus(b.id, e.target.value as Status)}
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={() => removeBook(b.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
