'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { PLANS, PLAN_KEYS } from '../lib/plans'
import type { PlanKey } from '../lib/types'

export function Subscribers() {
  const { subscribers, addSubscriber, removeSubscriber, toggleActive } = useApp()
  const [name, setName] = useState('')
  const [plan, setPlan] = useState<PlanKey>('starter')

  return (
    <section aria-label="Subscribers view">
      <h1>{`Subscribers (${subscribers.length})`}</h1>
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
            onChange={(e) => setPlan(e.target.value as PlanKey)}
          >
            {PLAN_KEYS.map((key) => (
              <option key={key} value={key}>
                {PLANS[key].label}
              </option>
            ))}
          </select>
        </label>
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
            <span>{PLANS[sub.plan].shortLabel}</span>
            <span>{`$${PLANS[sub.plan].price}`}</span>
            <input
              type="checkbox"
              aria-label={`Active: ${sub.name}`}
              checked={sub.active}
              onChange={() => toggleActive(sub.id)}
            />
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
