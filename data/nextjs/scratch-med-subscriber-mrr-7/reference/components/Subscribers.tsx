'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Plan } from '../lib/types'

const PLANS: Plan[] = ['Basic', 'Pro', 'Enterprise']

export function Subscribers() {
  const { subscribers, addSubscriber, toggleActive, hideInactive } = useApp()
  const [name, setName] = useState('')
  const [plan, setPlan] = useState<Plan>('Basic')

  const activeCount = subscribers.filter((s) => s.active).length
  const totalCount = subscribers.length
  const visible = hideInactive ? subscribers.filter((s) => s.active) : subscribers

  return (
    <section aria-label="Subscribers view">
      <h1>Subscribers</h1>
      <p>{`Active: ${activeCount} of ${totalCount}`}</p>
      <input
        aria-label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        aria-label="Plan"
        value={plan}
        onChange={(e) => setPlan(e.target.value as Plan)}
      >
        {PLANS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <button
        onClick={() => {
          addSubscriber(name, plan)
          setName('')
          setPlan('Basic')
        }}
      >
        Add subscriber
      </button>
      <ul>
        {visible.map((sub) => (
          <li key={sub.id}>
            <span>{sub.name}</span>
            <span>{sub.plan}</span>
            <button
              aria-label={`${sub.active ? 'Deactivate' : 'Activate'} ${sub.name}`}
              onClick={() => toggleActive(sub.id)}
            >
              {sub.active ? 'Deactivate' : 'Activate'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
