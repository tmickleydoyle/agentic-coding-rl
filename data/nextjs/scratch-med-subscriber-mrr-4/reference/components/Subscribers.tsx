'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Plan } from '../lib/types'
import { PLANS } from '../lib/plans'

export function Subscribers() {
  const { subscribers, addSubscriber, toggleActive, removeSubscriber, hideInactive } = useApp()
  const [name, setName] = useState('')
  const [plan, setPlan] = useState<Plan>('starter')

  const total = subscribers.length
  const activeCount = subscribers.filter((s) => s.active).length

  const visible = hideInactive ? subscribers.filter((s) => s.active) : subscribers

  return (
    <section aria-label="Subscribers view">
      <h1>Subscribers</h1>
      <p>{`Active: ${activeCount} of ${total}`}</p>
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
            <option key={p.key} value={p.key}>{p.label}</option>
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
        {visible.map((sub) => (
          <li key={sub.id}>
            <span>{sub.name}</span>
            <span>{PLANS.find((p) => p.key === sub.plan)?.name ?? sub.plan}</span>
            <label>
              <input
                type="checkbox"
                aria-label={`Active ${sub.name}`}
                checked={sub.active}
                onChange={() => toggleActive(sub.id)}
              />
              Active
            </label>
            <button aria-label={`Remove ${sub.name}`} onClick={() => removeSubscriber(sub.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
