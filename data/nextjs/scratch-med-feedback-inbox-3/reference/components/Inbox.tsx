'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Theme, SortOrder } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX']

export function Inbox() {
  const { items, addFeedback, upvote, sortOrder, setSortOrder } = useApp()
  const [note, setNote] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<Theme>('Bug')

  const sorted = [...items].sort((a, b) => {
    if (sortOrder === 'most-upvoted') return b.upvotes - a.upvotes
    return b.id - a.id
  })

  return (
    <section aria-label="Inbox view">
      <h1>{`Feedback (${items.length})`}</h1>
      <input
        aria-label="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <select
        aria-label="Theme"
        value={selectedTheme}
        onChange={(e) => setSelectedTheme(e.target.value as Theme)}
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <button
        onClick={() => {
          addFeedback(note, selectedTheme)
          setNote('')
        }}
      >
        Add feedback
      </button>
      <select
        aria-label="Sort by"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
      >
        <option value="newest">Newest</option>
        <option value="most-upvoted">Most upvoted</option>
      </select>
      <ul>
        {sorted.map((item) => (
          <li key={item.id}>
            <span>{item.note}</span>
            <span>{item.theme}</span>
            <span>{`Upvotes: ${item.upvotes}`}</span>
            <button aria-label={`Upvote ${item.note}`} onClick={() => upvote(item.id)}>
              Upvote
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
