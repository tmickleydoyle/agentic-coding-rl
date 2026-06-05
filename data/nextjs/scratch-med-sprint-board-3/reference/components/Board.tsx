'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

const STATUSES: Status[] = ['todo', 'doing', 'done']

export function Board() {
  const { tasks, addTask, deleteTask, setStatus } = useApp()
  const [name, setName] = useState('')
  const [points, setPoints] = useState('')
  const [filter, setFilter] = useState<'all' | Status>('all')

  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const doingCount = tasks.filter((t) => t.status === 'doing').length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  return (
    <section aria-label="Board view">
      <h1>Board</h1>
      <div>
        <input
          aria-label="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Points"
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <button
          onClick={() => {
            addTask(name, points)
            setName('')
            setPoints('')
          }}
        >
          Add task
        </button>
      </div>
      <p>{`To Do: ${todoCount}`}</p>
      <p>{`Doing: ${doingCount}`}</p>
      <p>{`Done: ${doneCount}`}</p>
      <div>
        <label htmlFor="filter-select">Filter</label>
        <select
          id="filter-select"
          aria-label="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | Status)}
        >
          <option value="all">all</option>
          <option value="todo">todo</option>
          <option value="doing">doing</option>
          <option value="done">done</option>
        </select>
      </div>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span>{` (${t.points} pts)`}</span>
            <select
              aria-label={`Status for ${t.name}`}
              value={t.status}
              onChange={(e) => setStatus(t.id, e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button aria-label={`Delete ${t.name}`} onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
