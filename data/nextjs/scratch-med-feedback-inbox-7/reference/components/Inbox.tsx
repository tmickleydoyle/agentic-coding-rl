'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Inbox() {
  const { items, addFeedback, upvote } = useApp()
  const [note, setNote] = useState('')
  const [theme, setTheme] = useState<Theme>('Bug')

  const sorted = [...items].sort((a, b) => b.upvotes - a.upvotes)

  return (
    <section aria-label="Inbox view">
      <h1>Inbox</h1>
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
          addFeedback(note, theme)
          setNote('')
        }}
      >
        Add feedback
      </button>
      <p>{`Feedback: ${items.length}`}</p>
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
