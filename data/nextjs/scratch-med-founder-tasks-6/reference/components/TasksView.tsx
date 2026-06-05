'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

type Filter = 'All' | 'High' | 'Med' | 'Low'

const FILTERS: Filter[] = ['All', 'High', 'Med', 'Low']

export function TasksView() {
  const { tasks, addTask, toggleDone, deleteTask } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('high')
  const [filter, setFilter] = useState<Filter>('All')

  const total = tasks.length
  const visible = tasks.filter((t) => {
    if (filter === 'All') return true
    return t.priority === filter.toLowerCase()
  })
  const shown = visible.length

  return (
    <section aria-label="Tasks view">
      <h1>Tasks</h1>
      <div>
        <input
          aria-label="Task name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          aria-label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="high">high</option>
          <option value="med">med</option>
          <option value="low">low</option>
        </select>
        <button
          onClick={() => {
            addTask(title, priority)
            setTitle('')
          }}
        >
          Add task
        </button>
      </div>
      <div>
        <span>Filter by priority</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {f}
          </button>
        ))}
      </div>
      <p>{`Showing: ${shown} of ${total}`}</p>
      {visible.length === 0 ? (
        <p>No tasks to show</p>
      ) : (
        <ul>
          {visible.map((t) => (
            <li key={t.id}>
              <span>{t.title}</span>
              <span>{t.priority}</span>
              <label>
                <input
                  type="checkbox"
                  aria-label="Done"
                  checked={t.done}
                  onChange={() => toggleDone(t.id)}
                />
                Done
              </label>
              <button aria-label={`Delete ${t.title}`} onClick={() => deleteTask(t.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
