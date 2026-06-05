'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { items, addItem, toggleItem, deleteItem } = useApp()
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState<'All' | 'Done' | 'Remaining'>('All')

  const total = items.length
  const doneCount = items.filter((i) => i.done).length
  const remainingCount = total - doneCount
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  const visible = items.filter((i) => {
    if (filter === 'Done') return i.done
    if (filter === 'Remaining') return !i.done
    return true
  })

  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
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
      <label htmlFor="filter-select">Filter</label>
      <select
        id="filter-select"
        aria-label="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value as 'All' | 'Done' | 'Remaining')}
      >
        <option value="All">All</option>
        <option value="Done">Done</option>
        <option value="Remaining">Remaining</option>
      </select>
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
      <p>{`Remaining: ${remainingCount}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
