'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { calcPct } from '../lib/utils'

export function Checklist() {
  const { items, addItem, toggleItem, removeItem } = useApp()
  const [title, setTitle] = useState('')

  const total = items.length
  const doneCount = items.filter((i) => i.done).length
  const remaining = total - doneCount
  const pct = calcPct(doneCount, total)

  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
      <p>{`Completion: ${pct}%`}</p>
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
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                aria-label={`Done: ${item.title}`}
                checked={item.done}
                onChange={() => toggleItem(item.id)}
              />
              {item.title}
            </label>
            <button aria-label={`Remove ${item.title}`} onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
