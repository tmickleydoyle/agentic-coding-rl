'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Plan } from '../lib/types'

const PLANS: Plan[] = ['Starter', 'Pro', 'Enterprise']
const PLAN_LABELS: Record<Plan, string> = {
  Starter: 'Starter ($29/mo)',
  Pro: 'Pro ($79/mo)',
  Enterprise: 'Enterprise ($199/mo)',
}

export function Subscribers() {
  const { subscribers, addSubscriber, toggleActive, removeSubscriber } = useApp()
  const [name, setName] = useState('')
  const [plan, setPlan] = useState<Plan>('Starter')

  return (
    <section aria-label="Subscribers view">
      <h1>{`Subscribers (${subscribers.length})`}</h1>
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
            <option key={p} value={p}>{PLAN_LABELS[p]}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addSubscriber(name, plan)
            setName('')
          }}
        >
          Add Subscriber
        </button>
      </div>
      <ul>
        {subscribers.map((sub) => (
          <li key={sub.id}>
            <span>{sub.name}</span>
            <span>{sub.plan}</span>
            <button
              aria-label={`Toggle active for ${sub.name}`}
              onClick={() => toggleActive(sub.id)}
            >
              {sub.active ? 'Active' : 'Inactive'}
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
