'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress, removeObjective } = useApp()
  const [title, setTitle] = useState('')
  const [inputs, setInputs] = useState<Record<number, string>>({})

  const total = objectives.length
  const avg = total === 0 ? 0 : Math.round(objectives.reduce((s, o) => s + o.progress, 0) / total)
  const onTrack = objectives.filter((o) => o.progress >= 70).length

  function handleUpdate(id: number) {
    const val = parseInt(inputs[id] ?? '0', 10)
    updateProgress(id, isNaN(val) ? 0 : val)
  }

  return (
    <section aria-label="Objectives view">
      <h1>Objectives</h1>
      <div>
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
      </div>
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
              value={inputs[o.id] ?? o.progress}
              onChange={(e) => setInputs((prev) => ({ ...prev, [o.id]: e.target.value }))}
            />
            <button onClick={() => handleUpdate(o.id)}>Update</button>
            <button onClick={() => removeObjective(o.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>{`Average: ${avg}%`}</p>
      <p>{`On track: ${onTrack}`}</p>
    </section>
  )
}
