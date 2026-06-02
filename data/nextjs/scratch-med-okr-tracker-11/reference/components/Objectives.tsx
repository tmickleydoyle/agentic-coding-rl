'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress } = useApp()
  const [title, setTitle] = useState('')
  const [pendingProgress, setPendingProgress] = useState<Record<number, number>>({}
  )

  function getPending(id: number, current: number): number {
    return pendingProgress[id] !== undefined ? pendingProgress[id] : current
  }

  return (
    <section aria-label="Objectives view">
      <h1>{`Objectives (${objectives.length})`}</h1>
      <input
        aria-label="Objective title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          addObjective(title)
          setTitle('')
        }}
      >
        Add objective
      </button>
      <ul>
        {objectives.map((o) => (
          <li key={o.id}>
            <span>{o.title}</span>
            <span>{`Progress: ${o.progress}%`}</span>
            <input
              type="number"
              aria-label={`Set progress for ${o.title}`}
              min={0}
              max={100}
              value={getPending(o.id, o.progress)}
              onChange={(e) =>
                setPendingProgress((prev) => ({
                  ...prev,
                  [o.id]: Number(e.target.value),
                }))
              }
            />
            <button
              onClick={() => {
                updateProgress(o.id, getPending(o.id, o.progress))
              }}
            >
              {`Update ${o.title}`}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
