'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Inbox() {
  const { entries, sort, addEntry, upvote, deleteEntry, setSort } = useApp()
  const [note, setNote] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<Theme>('Bug')

  const sorted = [...entries].sort((a, b) => {
    if (sort === 'upvotes') return b.upvotes - a.upvotes
    return b.id - a.id
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
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value as Theme)}
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addEntry(note, selectedTheme)
            setNote('')
          }}
        >
          Add feedback
        </button>
      </div>
      <div>
        <select
          aria-label="Sort by"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'newest' | 'upvotes')}
        >
          <option value="newest">Newest first</option>
          <option value="upvotes">Most upvoted</option>
        </select>
      </div>
      <ul>
        {sorted.map((entry) => (
          <li key={entry.id}>
            <span>{entry.note}</span>
            <span>{`Theme: ${entry.theme}`}</span>
            <span>{`Upvotes: ${entry.upvotes}`}</span>
            <button aria-label={`Upvote ${entry.note}`} onClick={() => upvote(entry.id)}>
              Upvote
            </button>
            <button aria-label={`Delete ${entry.note}`} onClick={() => deleteEntry(entry.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
