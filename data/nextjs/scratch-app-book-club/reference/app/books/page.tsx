'use client'
import React, { useEffect, useState } from 'react'
import { Book } from '../../lib/types'
export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filter, setFilter] = useState('all')
  const [title,setTitle] = useState(''), [author,setAuthor] = useState(''), [genre,setGenre] = useState(''), [year,setYear] = useState(''), [status,setStatus] = useState<Book['status']>('wishlist')
  function load() { fetch('/api/books').then(r=>r.json()).then(setBooks) }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/books',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,author,genre,year:Number(year),status})})
      .then(()=>{setTitle('');setAuthor('');setGenre('');setYear('');load()})
  }
  function handleDelete(id: string) { fetch('/api/books',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}).then(()=>load()) }
  const filtered = filter==='all' ? books : books.filter(b=>b.status===filter)
  return <div style={{padding:'2rem'}}><h1>Books</h1>
    <select data-testid="book-status-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">all</option><option value="reading">reading</option><option value="finished">finished</option><option value="wishlist">wishlist</option></select>
    <ul data-testid="book-list" style={{listStyle:'none',padding:0,marginTop:'1rem'}}>
      {filtered.map(b=><li key={b.id} data-testid="book-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{b.title}</strong> by {b.author} ({b.year}) — {b.genre} | {b.status}
        <button data-testid="delete-book" onClick={()=>handleDelete(b.id)} style={{marginLeft:'1rem'}}>Delete</button>
      </li>)}
    </ul>
    <h2>Add Book</h2>
    <form data-testid="add-book-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="book-title-input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
      <input data-testid="book-author-input" placeholder="Author" value={author} onChange={e=>setAuthor(e.target.value)} required/>
      <input data-testid="book-genre-input" placeholder="Genre" value={genre} onChange={e=>setGenre(e.target.value)} required/>
      <input data-testid="book-year-input" type="number" placeholder="Year" value={year} onChange={e=>setYear(e.target.value)} required/>
      <select data-testid="book-status-select" value={status} onChange={e=>setStatus(e.target.value as Book['status'])}><option value="wishlist">wishlist</option><option value="reading">reading</option><option value="finished">finished</option></select>
      <button data-testid="submit-book" type="submit">Add Book</button>
    </form>
  </div>
}
