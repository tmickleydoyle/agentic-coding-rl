'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

const STATUSES: Status[] = ['todo', 'doing', 'done']

export function Board() {
  const { tasks, addTask, setStatus, deleteTask, hideDone } = useApp()
  const [name, setName] = useState('')
  const [points, setPoints] = useState('')

  const countOf = (s: Status) => tasks.filter((t) => t.status === s).length
  const visible = tasks.filter((t) => !(hideDone && t.status === 'done'))

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
            addTask(name, Number(points))
            setName('')
            setPoints('')
          }}
        >
          Add task
        </button>
      </div>
      <p>{`To Do: ${countOf('todo')}`}</p>
      <p>{`Doing: ${countOf('doing')}`}</p>
      <p>{`Done: ${countOf('done')}`}</p>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span>{` (${t.points} pts)`}</span>
            <span>{` [${t.status}]`}</span>
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
