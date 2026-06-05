'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Influence } from '../lib/types'

const INFLUENCES: Influence[] = ['High', 'Medium', 'Low']

export function StakeholderList() {
  const { stakeholders, addStakeholder, removeStakeholder, toggleSupportive } = useApp()
  const [name, setName] = useState('')
  const [influence, setInfluence] = useState<Influence>('High')
  const [filter, setFilter] = useState<'All' | Influence>('All')

  const visible = filter === 'All' ? stakeholders : stakeholders.filter((s) => s.influence === filter)

  return (
    <section aria-label="Stakeholders view">
      <h1>{`Stakeholders (${visible.length})`}</h1>
      <input
        aria-label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        aria-label="Influence"
        value={influence}
        onChange={(e) => setInfluence(e.target.value as Influence)}
      >
        {INFLUENCES.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
      <button
        onClick={() => {
          addStakeholder(name, influence)
          setName('')
        }}
      >
        Add stakeholder
      </button>
      <select
        aria-label="Filter by influence"
        value={filter}
        onChange={(e) => setFilter(e.target.value as 'All' | Influence)}
      >
        <option value="All">All</option>
        {INFLUENCES.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
      <ul>
        {visible.map((s) => (
          <li key={s.id}>
            <span>{s.name}</span>
            <span>{s.influence}</span>
            <button
              aria-label={`Toggle supportive ${s.name}`}
              onClick={() => toggleSupportive(s.id)}
            >
              {`Supportive: ${s.supportive ? 'Yes' : 'No'}`}
            </button>
            <button
              aria-label={`Remove ${s.name}`}
              onClick={() => removeStakeholder(s.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
