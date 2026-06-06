'use client'
import { useState } from 'react'

export default function App() {
  const [newName, setNewName] = useState('')

  return (
    <div>
      <h1>Standup Notes</h1>
      <input aria-label="Date" type="date" defaultValue="2024-01-15" />
      <span data-testid="member-count">0</span>
      <input aria-label="New Member Name" value={newName} onChange={e => setNewName(e.target.value)} />
      <button>Add Member</button>
      <button>Generate</button>
      <button>Clear All</button>
    </div>
  )
}
