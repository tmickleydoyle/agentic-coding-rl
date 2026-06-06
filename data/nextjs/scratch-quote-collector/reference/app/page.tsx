'use client'
import { useState } from 'react'

interface Quote {
  id: number
  text: string
  author: string
  category: string
}

const SEED: Quote[] = [
  { id: 1, text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'Motivation' },
  { id: 2, text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein', category: 'Wisdom' },
  { id: 3, text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', category: 'Motivation' },
  { id: 4, text: "Life is what happens when you're busy making other plans.", author: 'John Lennon', category: 'Life' },
]

export default function App() {
  const [quotes, setQuotes] = useState<Quote[]>(SEED.map(q => ({ ...q })))
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [filter, setFilter] = useState('All')
  const [nextId, setNextId] = useState(5)

  function addQuote() {
    if (!text.trim() || !author.trim()) return
    const cat = category.trim() || 'General'
    setQuotes(qs => [...qs, { id: nextId, text: text.trim(), author: author.trim(), category: cat }])
    setNextId(n => n + 1)
    setText('')
    setAuthor('')
    setCategory('')
  }

  function removeQuote(id: number) {
    setQuotes(qs => qs.filter(q => q.id !== id))
  }

  const categories = Array.from(new Set(quotes.map(q => q.category))).sort()

  const displayed = filter === 'All' ? quotes : quotes.filter(q => q.category === filter)

  return (
    <div>
      <h1>Quote Collector</h1>

      <div>
        <textarea
          aria-label="Quote Text"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input
          aria-label="Author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <input
          aria-label="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <button onClick={addQuote}>Add Quote</button>
      </div>

      <label htmlFor="category-filter">Filter by Category</label>
      <select
        id="category-filter"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      >
        <option value="All">All</option>
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <ul>
        {displayed.map(q => (
          <li key={q.id} data-testid="quote-item">
            <span data-testid="quote-text">{q.text}</span>
            <span data-testid="quote-author">— {q.author}</span>
            <span data-testid="quote-category">{q.category}</span>
            <button onClick={() => removeQuote(q.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <p data-testid="quote-count">Showing {displayed.length} quote(s)</p>
    </div>
  )
}
