'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { items, addItem, toggleItem, clearDone, showDone } = useApp()
  const [title, setTitle] = useState('')
  const remaining = items.filter((i) => !i.done).length
  const visible = showDone ? items : items.filter((i) => !i.done)

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
        {visible.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                aria-label={`Mark ${item.title} done`}
                checked={item.done}
                onChange={() => toggleItem(item.id)}
              />
              {item.title}
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
