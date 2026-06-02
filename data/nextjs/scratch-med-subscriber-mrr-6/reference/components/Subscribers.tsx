'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { PLANS } from '../lib/plans'

export function Subscribers() {
  const { subscribers, addSubscriber, toggleActive, hideInactive } = useApp()
  const [name, setName] = useState('')
  const [planId, setPlanId] = useState('starter')

  const activeCount = subscribers.filter((s) => s.active).length
  const totalCount = subscribers.length
  const visible = hideInactive ? subscribers.filter((s) => s.active) : subscribers

  return (
    <section aria-label="Subscribers view">
      <h1>Subscribers</h1>
      <p>{`Active: ${activeCount} | Total: ${totalCount}`}</p>
      <div>
        <input
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          aria-label="Plan"
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
        >
          {PLANS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addSubscriber(name, planId)
            setName('')
          }}
        >
          Add subscriber
        </button>
      </div>
      <ul>
        {visible.map((sub) => {
          const plan = PLANS.find((p) => p.id === sub.planId)!
          return (
            <li key={sub.id}>
              <span>{sub.name}</span>
              <span>{plan.shortLabel}</span>
              <span>{`$${plan.price}`}</span>
              <span>{sub.active ? 'Active' : 'Inactive'}</span>
              <button onClick={() => toggleActive(sub.id)}>
                {sub.active ? 'Deactivate' : 'Activate'}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
