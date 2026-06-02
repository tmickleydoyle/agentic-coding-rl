'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { items, addItem, toggleItem, hideDone, toggleHideDone } = useApp()
  const [title, setTitle] = useState('')
  const remaining = items.filter((i) => !i.done).length
  const visible = hideDone ? items.filter((i) => !i.done) : items
  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
      <p>{`Remaining: ${remaining}`}</p>
      <label>
        <input
          type="checkbox"
          aria-label="Hide done"
          checked={hideDone}
          onChange={toggleHideDone}
        />
        Hide done
      </label>
      <div>
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
      </div>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                aria-label={`Done: ${item.title}`}
                checked={item.done}
                onChange={() => toggleItem(item.id)}
              />
              <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>{item.title}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
