'use client'
import { useState } from 'react'

interface Goal {
  id: number
  title: string
  target: number
  progress: number
  category: string
}

const SEED: Goal[] = [
  { id: 1, title: 'Learn TypeScript', target: 100, progress: 45, category: 'Learning' },
  { id: 2, title: 'Run a 5K', target: 5, progress: 2, category: 'Fitness' },
  { id: 3, title: 'Save $1000', target: 1000, progress: 300, category: 'Finance' },
]

export default function App() {
  const [goals, setGoals] = useState<Goal[]>(SEED.map(g => ({ ...g })))
  const [progressInputs, setProgressInputs] = useState<Record<number, string>>({})
  const [titleInput, setTitleInput] = useState('')
  const [targetInput, setTargetInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')

  function addGoal() {
    if (!titleInput.trim()) return
    const target = Number(targetInput) || 100
    setGoals(gs => [
      ...gs,
      { id: Date.now(), title: titleInput.trim(), target, progress: 0, category: categoryInput.trim() },
    ])
    setTitleInput('')
    setTargetInput('')
    setCategoryInput('')
  }

  function updateProgress(id: number) {
    const raw = Number(progressInputs[id] ?? 0)
    setGoals(gs =>
      gs.map(g => {
        if (g.id !== id) return g
        const clamped = Math.min(g.target, Math.max(0, raw))
        return { ...g, progress: clamped }
      })
    )
  }

  const completedCount = goals.filter(g => g.progress >= g.target).length

  return (
    <div>
      <h1>Goal Tracker</h1>
      <p data-testid="goal-count">Goals: {goals.length}</p>
      <p data-testid="completed-goals">Completed: {completedCount}</p>
      <ul>
        {goals.map(g => {
          const pct = Math.floor((g.progress / g.target) * 100)
          return (
            <li key={g.id} data-testid="goal-item">
              <span>{g.title}</span>
              <span>{g.category}</span>
              <div
                data-testid="progress-bar"
                style={{ width: `${pct}%`, height: '8px', background: '#4caf50' }}
              />
              <span data-testid="progress-text">{g.progress} / {g.target}</span>
              <span data-testid="progress-pct">{pct}%</span>
              <input
                type="number"
                aria-label={`Progress for ${g.title}`}
                value={progressInputs[g.id] ?? ''}
                onChange={e => setProgressInputs(p => ({ ...p, [g.id]: e.target.value }))}
              />
              <button onClick={() => updateProgress(g.id)}>Update Progress</button>
            </li>
          )
        })}
      </ul>
      <div>
        <input
          aria-label="Goal title"
          value={titleInput}
          onChange={e => setTitleInput(e.target.value)}
        />
        <input
          type="number"
          aria-label="Target value"
          value={targetInput}
          onChange={e => setTargetInput(e.target.value)}
        />
        <input
          aria-label="Category"
          value={categoryInput}
          onChange={e => setCategoryInput(e.target.value)}
        />
        <button onClick={addGoal}>Add Goal</button>
      </div>
    </div>
  )
}
