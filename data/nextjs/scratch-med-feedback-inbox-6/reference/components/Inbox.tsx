'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Inbox() {
  const { items, addFeedback, upvote, clearAll } = useApp()
  const [note, setNote] = useState('')
  const [theme, setTheme] = useState<Theme>('Bug')
  const [sortBy, setSortBy] = useState<'date' | 'upvotes'>('date')

  function handleAdd() {
    addFeedback(note, theme)
    setNote('')
    setTheme('Bug')
  }

  const sorted = [...items].sort((a, b) => {
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes
    return 0 // insertion order preserved (items already newest-first)
  })

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
        <button onClick={handleAdd}>Add feedback</button>
      </div>
      <div>
        <select
          aria-label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'upvotes')}
        >
          <option value="date">Date added</option>
          <option value="upvotes">Upvotes</option>
        </select>
        <button onClick={clearAll}>Clear all</button>
      </div>
      <ul>
        {sorted.map((item) => (
          <li key={item.id}>
            <span>{item.note}</span>
            <span>{`[${item.theme}]`}</span>
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
