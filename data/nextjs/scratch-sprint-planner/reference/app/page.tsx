'use client'
import { useState } from 'react'

type Status = 'todo' | 'in-progress' | 'done'

interface Story {
  id: number
  title: string
  points: number
  status: Status
}

const SEED: Story[] = [
  { id: 1, title: 'User authentication', points: 8, status: 'todo' },
  { id: 2, title: 'Dashboard layout', points: 5, status: 'in-progress' },
  { id: 3, title: 'API rate limiting', points: 3, status: 'done' },
  { id: 4, title: 'Email notifications', points: 5, status: 'todo' },
  { id: 5, title: 'Search functionality', points: 13, status: 'todo' },
]

export default function App() {
  const [stories, setStories] = useState<Story[]>(SEED.map(s => ({ ...s })))
  const [capacity, setCapacity] = useState(40)
  const [title, setTitle] = useState('')
  const [points, setPoints] = useState('')
  const [nextId, setNextId] = useState(6)

  function addStory() {
    const p = parseInt(points, 10)
    if (!title.trim() || !Number.isInteger(p) || p <= 0) return
    setStories(ss => [...ss, { id: nextId, title: title.trim(), points: p, status: 'todo' }])
    setNextId(n => n + 1)
    setTitle('')
    setPoints('')
  }

  function removeStory(id: number) {
    setStories(ss => ss.filter(s => s.id !== id))
  }

  function updateStatus(id: number, status: Status) {
    setStories(ss => ss.map(s => s.id === id ? { ...s, status } : s))
  }

  const totalPoints = stories.reduce((sum, s) => sum + s.points, 0)
  const donePoints = stories.filter(s => s.status === 'done').reduce((sum, s) => sum + s.points, 0)
  const remainingPoints = totalPoints - donePoints
  const capacityUsed = capacity > 0 ? Math.round(donePoints / capacity * 100) : 0
  const overCapacity = totalPoints > capacity

  return (
    <div>
      <h1>Sprint Planner</h1>
      <div>
        <label>
          Sprint Capacity (points)
          <input
            aria-label="Sprint Capacity (points)"
            type="number"
            value={capacity}
            onChange={e => setCapacity(parseInt(e.target.value, 10) || 0)}
          />
        </label>
      </div>
      <div>
        <input
          aria-label="Story Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          aria-label="Story Points"
          type="number"
          value={points}
          onChange={e => setPoints(e.target.value)}
        />
        <button onClick={addStory}>Add Story</button>
      </div>
      <ul>
        {stories.map(s => (
          <li key={s.id} data-testid="story-item">
            <span>{s.title}</span>
            <span data-testid="story-points">{s.points}</span>
            <select
              value={s.status}
              onChange={e => updateStatus(s.id, e.target.value as Status)}
              aria-label={`status of ${s.title}`}
            >
              <option value="todo">todo</option>
              <option value="in-progress">in-progress</option>
              <option value="done">done</option>
            </select>
            <button onClick={() => removeStory(s.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <span data-testid="total-points">{totalPoints}</span>
        <span data-testid="done-points">{donePoints}</span>
        <span data-testid="remaining-points">{remainingPoints}</span>
        <span data-testid="capacity-used">{capacityUsed}%</span>
        {overCapacity && <span data-testid="over-capacity">Over capacity!</span>}
      </div>
    </div>
  )
}
