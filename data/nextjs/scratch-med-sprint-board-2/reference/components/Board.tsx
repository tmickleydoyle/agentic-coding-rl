'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

type Filter = 'all' | Status

export function Board() {
  const { tasks, addTask, startTask, completeTask, deleteTask } = useApp()
  const [name, setName] = useState('')
  const [points, setPoints] = useState('1')
  const [filter, setFilter] = useState<Filter>('all')

  const count = (s: Status) => tasks.filter((t) => t.status === s).length
  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0)

  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  function handleAdd() {
    const pts = parseInt(points, 10)
    addTask(name, isNaN(pts) ? 0 : pts)
    setName('')
    setPoints('1')
  }

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
        <button onClick={handleAdd}>Add task</button>
      </div>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('todo')}>To Do</button>
        <button onClick={() => setFilter('doing')}>Doing</button>
        <button onClick={() => setFilter('done')}>Done</button>
      </div>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span>{` — ${t.points} pts — `}</span>
            <span>{t.status}</span>
            {t.status === 'todo' && (
              <button aria-label={`Start ${t.name}`} onClick={() => startTask(t.id)}>
                Start
              </button>
            )}
            {t.status === 'doing' && (
              <button aria-label={`Complete ${t.name}`} onClick={() => completeTask(t.id)}>
                Complete
              </button>
            )}
            <button aria-label={`Delete ${t.name}`} onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>{`To Do: ${count('todo')}`}</p>
      <p>{`Doing: ${count('doing')}`}</p>
      <p>{`Done: ${count('done')}`}</p>
      <p>{`Total points: ${totalPoints}`}</p>
    </section>
  )
}
