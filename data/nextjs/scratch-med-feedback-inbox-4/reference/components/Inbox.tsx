'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Inbox() {
  const { items, addItem, upvote, sortOrder, setSortOrder } = useApp()
  const [note, setNote] = useState('')
  const [theme, setTheme] = useState<Theme>('Bug')

  const sorted = sortOrder === 'upvotes'
    ? [...items].sort((a, b) => b.upvotes - a.upvotes)
    : [...items]

  return (
    <section aria-label="Inbox view">
      <h1>Inbox</h1>
      <div>
        <input
          aria-label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <select
          aria-label="Theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addItem(note, theme)
            setNote('')
          }}
        >
          Add feedback
        </button>
      </div>
      <div>
        <label>
          Sort by
          <select
            aria-label="Sort by"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'upvotes')}
          >
            <option value="newest">Newest</option>
            <option value="upvotes">Most upvoted</option>
          </select>
        </label>
      </div>
      <p>{`Total feedback: ${items.length}`}</p>
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
