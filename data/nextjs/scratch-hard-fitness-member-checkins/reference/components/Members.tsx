'use client'
import { useState } from 'react'
import { useGym } from '../hooks/useGym'

export function Members() {
  const { members, addMember } = useGym()
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')

  return (
    <section aria-label="Members view">
      <h1>Members</h1>
      <input aria-label="Member name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        aria-label="Monthly goal"
        type="number"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button
        onClick={() => {
          addMember(name, goal)
          setName('')
          setGoal('')
        }}
      >
        Add member
      </button>
      <ul>
        {members.map((m) => (
          <li key={m.id}>{`${m.name} (goal ${m.goal})`}</li>
        ))}
      </ul>
    </section>
  )
}
