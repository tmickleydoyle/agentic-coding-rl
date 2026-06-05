'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Backlog() {
  const { backlog, addIdea, promote } = useApp()
  const [title, setTitle] = useState('')
  return (
    <section aria-label="Backlog view">
      <h1>Backlog</h1>
      <input aria-label="Backlog idea" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button
        onClick={() => {
          addIdea(title)
          setTitle('')
        }}
      >
        Add idea
      </button>
      <ul>
        {backlog.map((b) => (
          <li key={b.id}>
            <span>{b.title}</span>
            <button aria-label={`Promote ${b.title}`} onClick={() => promote(b.id)}>
              Promote
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
