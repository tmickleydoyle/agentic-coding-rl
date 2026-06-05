'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { PLAN_PRICE, PLANS } from '../lib/plans'
import type { Plan } from '../lib/types'

export function Subscribers() {
  const { subscribers, addSubscriber, toggleActive, removeSubscriber, filterInactive } = useApp()
  const [name, setName] = useState('')
  const [plan, setPlan] = useState<Plan>('Starter')

  const activeSubs = subscribers.filter((s) => s.active)
  const mrr = activeSubs.reduce((sum, s) => sum + PLAN_PRICE[s.plan], 0)
  const displayed = filterInactive ? subscribers.filter((s) => s.active) : subscribers

  return (
    <section aria-label="Subscribers view">
      <h1>Subscribers</h1>
      <p>{`Active: ${activeSubs.length} | MRR: $${mrr}`}</p>
      <ul>
        {displayed.map((sub) => (
          <li key={sub.id}>
            <span>{sub.name}</span>
            <span>{sub.plan}</span>
            <span>{`$${PLAN_PRICE[sub.plan]}/mo`}</span>
            <button
              aria-label={`Toggle ${sub.name}`}
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
      <div>
        <label>
          Name
          <input
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Plan
          <select
            aria-label="Plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value as Plan)}
          >
            {PLANS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => {
            addSubscriber(name, plan)
            setName('')
            setPlan('Starter')
          }}
        >
          Add Subscriber
        </button>
      </div>
    </section>
  )
}
