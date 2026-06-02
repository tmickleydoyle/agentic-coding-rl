'use client'
import { useState } from 'react'
import { useGym } from '../hooks/useGym'

export function CheckIns() {
  const { members, checkins, checkIn } = useGym()
  const [memberId, setMemberId] = useState('')

  const countFor = (id: number) => checkins.filter((c) => c.memberId === id).length

  return (
    <section aria-label="Check-ins view">
      <h1>Check-ins</h1>
      <select aria-label="Member" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
        <option value="">Select a member</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <button onClick={() => checkIn(memberId)}>Check in</button>
      <ul>
        {members.map((m) => (
          <li key={m.id}>{`${m.name}: ${countFor(m.id)} check-ins`}</li>
        ))}
      </ul>
    </section>
  )
}
