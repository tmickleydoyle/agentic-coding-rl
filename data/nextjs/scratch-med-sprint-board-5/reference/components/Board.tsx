'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

const STATUSES: Status[] = ['todo', 'doing', 'done']

function sectionLabel(status: Status): string {
  if (status === 'todo') return 'To Do'
  if (status === 'doing') return 'Doing'
  return 'Done'
}

export function Board() {
  const { tasks, addTask, setStatus, deleteTask, hideDone } = useApp()
  const [name, setName] = useState('')
  const [points, setPoints] = useState('')

  function handleAdd() {
    const pts = parseInt(points, 10)
    addTask(name, pts)
    setName('')
    setPoints('')
  }

  return (
    <section aria-label="Board view">
      <h1>Board</h1>
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
      <button onClick={handleAdd}>Add task</button>

      {STATUSES.map((status) => {
        const all = tasks.filter((t) => t.status === status)
        const count = all.length
        const pts = all.reduce((s, t) => s + t.points, 0)
        const label = sectionLabel(status)
        const visible = hideDone && status === 'done' ? [] : all
        return (
          <section key={status} aria-label={label}>
            <h2>{`${label} (${count} tasks, ${pts} pts)`}</h2>
            <ul>
              {visible.map((t) => (
                <li key={t.id}>
                  <span>{t.name}</span>
                  <span>{` — ${t.points} pts`}</span>
                  <select
                    aria-label={`Status of ${t.name}`}
                    value={t.status}
                    onChange={(e) => setStatus(t.id, e.target.value as Status)}
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
      })}
    </section>
  )
}
