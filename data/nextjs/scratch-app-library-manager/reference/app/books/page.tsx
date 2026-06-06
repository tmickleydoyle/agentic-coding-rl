'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Book } from '../../lib/types'

export function BooksPage() {
  const { triggerRefresh } = useApp()
  const [books, setBooks] = useState<Book[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isbn, setIsbn] = useState('')
  const [genre, setGenre] = useState('')

  function load() {
    fetch('/api/books').then(r => r.json()).then(setBooks)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, isbn, genre }),
    })
    setTitle(''); setAuthor(''); setIsbn(''); setGenre('')
    load()
    triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Books</h1>
      <form data-testid="add-book-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <input data-testid="input-author" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" required />
        <input data-testid="input-isbn" value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="ISBN" required />
        <input data-testid="input-genre" value={genre} onChange={e => setGenre(e.target.value)} placeholder="Genre" required />
        <button data-testid="btn-add-book" type="submit">Add Book</button>
      </form>
      <ul data-testid="book-list" style={{ listStyle: 'none', padding: 0 }}>
        {books.map(book => (
          <li key={book.id} data-testid="book-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="book-title" style={{ fontWeight: 'bold' }}>{book.title}</span>
            {' — '}
            <span data-testid="book-author">{book.author}</span>
            {' | '}
            <span data-testid="book-status" style={{ color: book.available ? 'green' : 'red' }}>
              {book.available ? 'Available' : 'On Loan'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
