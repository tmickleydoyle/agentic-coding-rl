'use client'
import { useState } from 'react'

type Category = 'feature' | 'bugfix' | 'improvement'

interface Note {
  id: number
  version: string
  product: string
  category: Category
  title: string
  body: string
  published: boolean
}

const SEED: Note[] = [
  { id: 1, version: '2.5.0', product: 'Web App', category: 'feature', title: 'Drag and drop file upload', body: 'Users can now upload files by dragging them directly into the browser.', published: true },
  { id: 2, version: '2.5.0', product: 'Mobile App', category: 'bugfix', title: 'Fixed crash on startup', body: 'Resolved a crash that occurred when opening the app on iOS 17.', published: true },
  { id: 3, version: '2.6.0', product: 'Web App', category: 'improvement', title: 'Faster page loads', body: 'Optimized asset loading to reduce initial page load time by 40%.', published: false },
]

export default function App() {
  const [notes, setNotes] = useState<Note[]>(SEED.map(n => ({ ...n })))
  const [version, setVersion] = useState('')
  const [product, setProduct] = useState('')
  const [category, setCategory] = useState<Category>('feature')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [filterCategory, setFilterCategory] = useState<'All' | Category>('All')
  const [filterProduct, setFilterProduct] = useState('All')
  const [nextId, setNextId] = useState(4)

  function addNote() {
    if (!title.trim()) return
    setNotes(prev => [...prev, { id: nextId, version: version.trim(), product: product.trim(), category, title: title.trim(), body: body.trim(), published: false }])
    setNextId(n => n + 1)
    setVersion('')
    setProduct('')
    setCategory('feature')
    setTitle('')
    setBody('')
  }

  function togglePublished(id: number) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, published: !n.published } : n))
  }

  function deleteNote(id: number) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const countPublished = notes.filter(n => n.published).length
  const countDraft = notes.filter(n => !n.published).length

  const allProducts = ['All', ...Array.from(new Set(notes.map(n => n.product).filter(Boolean)))]

  const visible = notes.filter(n => {
    const catMatch = filterCategory === 'All' || n.category === filterCategory
    const prodMatch = filterProduct === 'All' || n.product === filterProduct
    return catMatch && prodMatch
  })

  return (
    <div>
      <h1>Release Notes</h1>

      <div>
        <span data-testid="count-published">Published: {countPublished}</span>
        <span data-testid="count-draft">Draft: {countDraft}</span>
      </div>

      <div>
        <input
          aria-label="Version"
          value={version}
          onChange={e => setVersion(e.target.value)}
        />
        <input
          aria-label="Product"
          value={product}
          onChange={e => setProduct(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
        >
          <option value="feature">feature</option>
          <option value="bugfix">bugfix</option>
          <option value="improvement">improvement</option>
        </select>
        <input
          aria-label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          aria-label="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <button onClick={addNote}>Add Note</button>
      </div>

      <div>
        <select
          aria-label="Filter by category"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value as 'All' | Category)}
        >
          <option value="All">All</option>
          <option value="feature">feature</option>
          <option value="bugfix">bugfix</option>
          <option value="improvement">improvement</option>
        </select>
        <select
          aria-label="Filter by product"
          value={filterProduct}
          onChange={e => setFilterProduct(e.target.value)}
        >
          {allProducts.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <ul>
        {visible.map(note => (
          <li key={note.id} data-testid="note-item">
            <span data-testid="note-version">{note.version}</span>
            <span data-testid="note-product">{note.product}</span>
            <span data-testid="note-category">{note.category}</span>
            <span data-testid="note-title">{note.title}</span>
            <span data-testid="note-body">{note.body}</span>
            <span data-testid="note-status">{note.published ? 'Published' : 'Draft'}</span>
            <button onClick={() => togglePublished(note.id)}>
              {note.published ? 'Unpublish' : 'Publish'}
            </button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
