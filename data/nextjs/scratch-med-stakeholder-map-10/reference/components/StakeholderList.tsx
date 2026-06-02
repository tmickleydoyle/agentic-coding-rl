'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Influence } from '../lib/types'

export function StakeholderList() {
  const { stakeholders, addStakeholder, removeStakeholder, toggleSupportive } = useApp()
  const [name, setName] = useState('')
  const [influence, setInfluence] = useState<Influence>('high')
  const [filter, setFilter] = useState<'all' | Influence>('all')

  const visible =
    filter === 'all' ? stakeholders : stakeholders.filter((s) => s.influence === filter)

  return (
    <section aria-label="Stakeholders view">
      <h1>{`Stakeholders (${visible.length})`}</h1>
      <div>
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
          <option value="high">high</option>
          <option value="med">med</option>
          <option value="low">low</option>
        </select>
        <button
          onClick={() => {
            addStakeholder(name, influence)
            setName('')
          }}
        >
          Add stakeholder
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by influence"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | Influence)}
        >
          <option value="all">all</option>
          <option value="high">high</option>
          <option value="med">med</option>
          <option value="low">low</option>
        </select>
      </div>
      <ul>
        {visible.map((s) => (
          <li key={s.id}>
            <span>{s.name}</span>
            <span>{s.influence}</span>
            <button onClick={() => toggleSupportive(s.id)}>
              {s.supportive ? 'Supportive' : 'Not supportive'}
            </button>
            <button aria-label={`Remove ${s.name}`} onClick={() => removeStakeholder(s.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
