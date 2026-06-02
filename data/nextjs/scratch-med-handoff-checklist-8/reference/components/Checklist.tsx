'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { items, addItem, toggleItem, deleteItem } = useApp()
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState<'All' | 'Done' | 'Pending'>('All')

  const remaining = items.filter((i) => !i.done).length

  const visible = items.filter((i) => {
    if (filter === 'Done') return i.done
    if (filter === 'Pending') return !i.done
    return true
  })

  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
      <p>{`Remaining: ${remaining}`}</p>
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
      <div>
        <label htmlFor="filter-select">Filter</label>
        <select
          id="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | 'Done' | 'Pending')}
        >
          <option value="All">All</option>
          <option value="Done">Done</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <button onClick={() => toggleItem(item.id)}>
              {item.done ? 'Mark undone' : 'Mark done'}
            </button>
            <button aria-label={`Delete ${item.title}`} onClick={() => deleteItem(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
