'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { tasks, addTask, toggleDone, deleteTask, hideCompleted, toggleHideCompleted } = useApp()
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')

  const total = tasks.length
  const remaining = tasks.filter((t) => !t.done).length
  const visible = hideCompleted ? tasks.filter((t) => !t.done) : tasks

  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
      <input
        aria-label="Task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="Owner"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      />
      <button
        onClick={() => {
          addTask(name, owner)
          setName('')
          setOwner('')
        }}
      >
        Add task
      </button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide completed"
          checked={hideCompleted}
          onChange={toggleHideCompleted}
        />
        Hide completed
      </label>
      <h2>{`Tasks (${total})`}</h2>
      <p>{`Remaining: ${remaining}`}</p>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            {t.owner && <span>{t.owner}</span>}
            <button
              aria-label={t.done ? `Mark ${t.name} undone` : `Mark ${t.name} done`}
              onClick={() => toggleDone(t.id)}
            >
              {t.done ? 'Mark undone' : 'Mark done'}
            </button>
            <button aria-label={`Delete ${t.name}`} onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
