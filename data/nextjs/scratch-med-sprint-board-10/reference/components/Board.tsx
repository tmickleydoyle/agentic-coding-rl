'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

const STATUSES: Status[] = ['todo', 'doing', 'done']
const LABELS: Record<Status, string> = { todo: 'Todo', doing: 'Doing', done: 'Done' }

export function Board() {
  const { tasks, addTask, setStatus, deleteTask, hideDone } = useApp()
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
      <div>
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
          min={1}
        />
        <button onClick={handleAdd}>Add task</button>
      </div>
      {STATUSES.map((status) => {
        const allInStatus = tasks.filter((t) => t.status === status)
        const count = allInStatus.length
        const totalPts = allInStatus.reduce((sum, t) => sum + t.points, 0)
        const visible = hideDone && status === 'done' ? [] : allInStatus
        return (
          <section key={status} aria-label={LABELS[status]}>
            <h2>{`${LABELS[status]} (${count})`}</h2>
            <p>{`Points: ${totalPts}`}</p>
            <ul>
              {visible.map((t) => (
                <li key={t.id}>
                  <span>{`${t.title} (Pts: ${t.points})`}</span>
                  <select
                    aria-label={`Status of ${t.title}`}
                    value={t.status}
                    onChange={(e) => setStatus(t.id, e.target.value as Status)}
                  >
                    <option value="todo">Todo</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                  </select>
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
