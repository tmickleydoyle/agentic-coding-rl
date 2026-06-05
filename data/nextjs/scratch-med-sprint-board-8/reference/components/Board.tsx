'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

const STATUSES: Status[] = ['todo', 'doing', 'done']
const LABELS: Record<Status, string> = { todo: 'To Do', doing: 'Doing', done: 'Done' }

export function Board() {
  const { tasks, addTask, updateStatus, deleteTask } = useApp()
  const [name, setName] = useState('')
  const [points, setPoints] = useState('1')
  const [filter, setFilter] = useState<'all' | Status>('all')

  function countFor(s: Status) { return tasks.filter((t) => t.status === s).length }
  function ptsFor(s: Status) { return tasks.filter((t) => t.status === s).reduce((a, t) => a + t.points, 0) }

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
          min={1}
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <button
          onClick={() => {
            addTask(name, parseInt(points, 10) || 1)
            setName('')
            setPoints('1')
          }}
        >
          Add task
        </button>
      </div>
      <div>
        {STATUSES.map((s) => (
          <p key={s}>{`${LABELS[s]}: ${countFor(s)} tasks, ${ptsFor(s)} pts`}</p>
        ))}
      </div>
      <label>
        Filter by status
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | Status)}
        >
          <option value="all">All</option>
          <option value="todo">todo</option>
          <option value="doing">doing</option>
          <option value="done">done</option>
        </select>
      </label>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span>{` (${t.points} pts)`}</span>
            <select
              aria-label={`Status for ${t.name}`}
              value={t.status}
              onChange={(e) => updateStatus(t.id, e.target.value as Status)}
            >
              <option value="todo">todo</option>
              <option value="doing">doing</option>
              <option value="done">done</option>
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
