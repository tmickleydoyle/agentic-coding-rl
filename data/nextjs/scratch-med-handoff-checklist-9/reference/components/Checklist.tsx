'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { items, addItem, toggleItem, clearDone, showOnlyRemaining } = useApp()
  const [title, setTitle] = useState('')
  const remaining = items.filter((it) => !it.done).length
  const visible = showOnlyRemaining ? items.filter((it) => !it.done) : items
  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
      <p>{`Remaining: ${remaining}`}</p>
      <input
        aria-label="New item"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          addItem(title)
          setTitle('')
        }}
      >
        Add item
      </button>
      <button onClick={clearDone}>Clear done</button>
      <ul>
        {visible.map((it) => (
          <li key={it.id}>
            <label>
              <input
                type="checkbox"
                aria-label={it.title}
                checked={it.done}
                onChange={() => toggleItem(it.id)}
              />
              {it.title}
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
