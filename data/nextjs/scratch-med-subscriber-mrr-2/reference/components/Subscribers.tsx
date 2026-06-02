'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Plan } from '../lib/types'
import { PLANS } from '../lib/types'

export function Subscribers() {
  const { subscribers, mrr, activeCount, addSubscriber, toggleActive, removeSubscriber } = useApp()
  const [name, setName] = useState('')
  const [plan, setPlan] = useState<Plan>('Basic')

  return (
    <section aria-label="Subscribers view">
      <h1>Subscribers</h1>
      <p>{`MRR: $${mrr}`}</p>
      <p>{`Active: ${activeCount}`}</p>
      <div>
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
          }}
        >
          Add
        </button>
      </div>
      <ul>
        {subscribers.map((sub) => (
          <li key={sub.id}>
            <span>{sub.name}</span>
            <span>{sub.plan}</span>
            <span>{sub.active ? 'Active' : 'Inactive'}</span>
            <button
              aria-label={sub.active ? `Deactivate ${sub.name}` : `Activate ${sub.name}`}
              onClick={() => toggleActive(sub.id)}
            >
              {sub.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              aria-label={`Remove ${sub.name}`}
              onClick={() => removeSubscriber(sub.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
