'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

export function Inbox() {
  const { items, addFeedback, upvote, sortOrder, setSortOrder } = useApp()
  const [note, setNote] = useState('')
  const [feedbackTheme, setFeedbackTheme] = useState<Theme>('Bug')

  const sorted = sortOrder === 'newest'
    ? [...items].reverse()
    : [...items].sort((a, b) => b.upvotes - a.upvotes)

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
          value={feedbackTheme}
          onChange={(e) => setFeedbackTheme(e.target.value as Theme)}
        >
          <option value="Bug">Bug</option>
          <option value="Feature">Feature</option>
          <option value="UX">UX</option>
          <option value="Other">Other</option>
        </select>
        <button
          onClick={() => {
            addFeedback(note, feedbackTheme)
            setNote('')
            setFeedbackTheme('Bug')
          }}
        >
          Add feedback
        </button>
      </div>
      <div>
        <select
          aria-label="Sort by"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'upvoted')}
        >
          <option value="newest">Newest</option>
          <option value="upvoted">Most upvoted</option>
        </select>
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
