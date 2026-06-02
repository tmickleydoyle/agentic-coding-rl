'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { tasks, addTask, toggleDone, hideCompleted } = useApp()
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')

  const remaining = tasks.filter((t) => !t.done).length
  const visible = hideCompleted ? tasks.filter((t) => !t.done) : tasks

  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
      <p>{`Remaining: ${remaining}`}</p>
      <input aria-label="Task name" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
      <button
        onClick={() => {
          addTask(name, owner)
          setName('')
          setOwner('')
        }}
      >
        Add task
      </button>
      <ul>
        {visible.map((t) => (
          <li key={t.id} data-done={t.done ? 'true' : 'false'}>
            <span>{t.name}</span>
            <span>{t.owner}</span>
            <label>
              <input
                type="checkbox"
                aria-label={`Done: ${t.name}`}
                checked={t.done}
                onChange={() => toggleDone(t.id)}
              />
              Done
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
