'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Reviews() {
  const { items, filter, addItem, setStatus, deleteItem, setFilter } = useApp()
  const [title, setTitle] = useState('')
  const [reviewer, setReviewer] = useState('')

  const visible = filter === 'all' ? items : items.filter((i) => i.status === filter)

  return (
    <section aria-label="Reviews view">
      <h1>Reviews</h1>
      <div>
        <input
          aria-label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          aria-label="Reviewer"
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
        />
        <button
          onClick={() => {
            addItem(title, reviewer)
            setTitle('')
            setReviewer('')
          }}
        >
          Add item
        </button>
      </div>
      <div>
        <label htmlFor="filter-select">Filter by status</label>
        <select
          id="filter-select"
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="draft">draft</option>
          <option value="approved">approved</option>
          <option value="changes">changes</option>
        </select>
      </div>
      <h2>{`Items (${visible.length})`}</h2>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.reviewer}</span>
            <span>{item.status}</span>
            <button onClick={() => setStatus(item.id, 'approved')}>Approve</button>
            <button onClick={() => setStatus(item.id, 'changes')}>Request changes</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
