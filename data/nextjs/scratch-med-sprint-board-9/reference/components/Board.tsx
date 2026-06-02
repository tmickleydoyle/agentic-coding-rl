'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

const GROUPS: [Status, string][] = [
  ['todo', 'Todo'],
  ['doing', 'Doing'],
  ['done', 'Done'],
]

const NEXT_LABEL: Record<Status, string> = {
  todo: 'Start',
  doing: 'Finish',
  done: 'Reset',
}

export function Board() {
  const { tasks, addTask, cycleStatus, deleteTask } = useApp()
  const [title, setTitle] = useState('')
  const [points, setPoints] = useState('1')

  return (
    <section aria-label="Board view">
      <h1>Board</h1>
      <input
        aria-label="Task title"
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
          addTask(title, Number(points))
          setTitle('')
          setPoints('1')
        }}
      >
        Add task
      </button>
      {GROUPS.map(([status, label]) => {
        const group = tasks.filter((t) => t.status === status)
        const count = group.length
        const pts = group.reduce((s, t) => s + t.points, 0)
        return (
          <section key={status} aria-label={label}>
            <h2>{`${label} (${count}) — ${pts} pts`}</h2>
            <ul>
              {group.map((t) => (
                <li key={t.id}>
                  <span>{t.title}</span>
                  <span>{` (${t.points} pts)`}</span>
                  <button
                    aria-label={`${NEXT_LABEL[t.status]} ${t.title}`}
                    onClick={() => cycleStatus(t.id)}
                  >
                    {NEXT_LABEL[t.status]}
                  </button>
                  <button
                    aria-label={`Delete ${t.title}`}
                    onClick={() => deleteTask(t.id)}
                  >
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
