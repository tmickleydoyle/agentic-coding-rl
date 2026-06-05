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
  const { board, addTask, moveTask, showCompleted } = useApp()
  const [title, setTitle] = useState('')
  return (
    <section aria-label="Board view">
      <h1>Board</h1>
      <input aria-label="New task" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button
        onClick={() => {
          addTask(title)
          setTitle('')
        }}
      >
        Add task
      </button>
      {COLUMNS.map(([status, label]) => {
        const count = board.filter((t) => t.status === status).length
        const items = board.filter(
          (t) => t.status === status && (showCompleted || status !== 'done'),
        )
        return (
          <section key={status} aria-label={label}>
            <h2>{`${label} (${count})`}</h2>
            <ul>
              {items.map((t) => (
                <li key={t.id}>
                  <span>{t.title}</span>
                  <button
                    aria-label={`Move ${t.title} left`}
                    disabled={status === 'todo'}
                    onClick={() => moveTask(t.id, -1)}
                  >
                    Left
                  </button>
                  <button
                    aria-label={`Move ${t.title} right`}
                    disabled={status === 'done'}
                    onClick={() => moveTask(t.id, 1)}
                  >
                    Right
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
