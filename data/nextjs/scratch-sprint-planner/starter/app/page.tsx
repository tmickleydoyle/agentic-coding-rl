'use client'
import { useState } from 'react'

export default function App() {
  const [title, setTitle] = useState('')
  const [points, setPoints] = useState('')

  return (
    <div>
      <h1>Sprint Planner</h1>
      <input aria-label="Sprint Capacity (points)" type="number" defaultValue={40} />
      <input aria-label="Story Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input aria-label="Story Points" type="number" value={points} onChange={e => setPoints(e.target.value)} />
      <button>Add Story</button>
      <ul></ul>
      <div>
        <span data-testid="total-points">0</span>
        <span data-testid="done-points">0</span>
        <span data-testid="remaining-points">0</span>
        <span data-testid="capacity-used">0%</span>
      </div>
    </div>
  )
}
