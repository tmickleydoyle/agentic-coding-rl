'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

const COLUMNS: [Status, string][] = [
  ['todo', 'To Do'],
  ['inprogress', 'In Progress'],
  ['done', 'Done'],
]

export function Board() {
  const { tasks, addTask, moveTask, hideDone } = useApp()
  const [title, setTitle] = useState('')
  const [points, setPoints] = useState('1')

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
      <button
        onClick={() => {
          addTask(title, parseInt(points, 10) || 1)
          setTitle('')
          setPoints('1')
        }}
      >
        Add task
      </button>
      {COLUMNS.map(([status, label]) => {
        const colTasks = tasks.filter((t) => t.status === status)
        const count = colTasks.length
        const totalPts = colTasks.reduce((s, t) => s + t.points, 0)
        const visibleTasks = hideDone && status === 'done' ? [] : colTasks
        return (
          <section key={status} aria-label={label}>
            <h2>{`${label} (${count})`}</h2>
            <p>{`Points: ${totalPts}`}</p>
            <ul>
              {visibleTasks.map((t) => (
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
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </section>
  )
}
