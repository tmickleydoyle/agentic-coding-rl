'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

const COLUMNS: [Status, string][] = [
  ['todo', 'To Do'],
  ['doing', 'Doing'],
  ['done', 'Done'],
]

export function Board() {
  const { tasks, addTask, moveTask, deleteTask, hideDone } = useApp()
  const [title, setTitle] = useState('')
  const [points, setPoints] = useState('1')

  function handleAdd() {
    const pts = parseInt(points, 10)
    addTask(title, Number.isInteger(pts) && pts > 0 ? pts : 1)
    setTitle('')
    setPoints('1')
  }

  return (
    <section aria-label="Board view">
      <h1>Board</h1>
      <input
        aria-label="Task name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        aria-label="Points"
        type="number"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
      />
      <button onClick={handleAdd}>Add task</button>
      {COLUMNS.map(([status, label]) => {
        const colTasks = tasks.filter((t) => t.status === status)
        const count = colTasks.length
        const pts = colTasks.reduce((sum, t) => sum + t.points, 0)
        const visible = hideDone && status === 'done' ? [] : colTasks
        return (
          <section key={status} aria-label={label}>
            <h2>{`${label} (${count}) — ${pts} pts`}</h2>
            <ul>
              {visible.map((t) => (
                <li key={t.id}>
                  <span>{t.title}</span>
                  <span>{` (${t.points} pts)`}</span>
                  <button
                    aria-label={`Move ${t.title} left`}
                    disabled={status === 'todo'}
                    onClick={() => moveTask(t.id, -1)}
                  >
                    Move left
                  </button>
                  <button
                    aria-label={`Move ${t.title} right`}
                    disabled={status === 'done'}
                    onClick={() => moveTask(t.id, 1)}
                  >
                    Move right
                  </button>
                  <button aria-label={`Delete ${t.title}`} onClick={() => deleteTask(t.id)}>
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
