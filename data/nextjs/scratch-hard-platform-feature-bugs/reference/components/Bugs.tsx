'use client'
import { useState } from 'react'
import { usePlatform } from '../hooks/usePlatform'
import { SEVERITIES } from '../lib/types'
import type { Severity } from '../lib/types'

export function Bugs() {
  const { features, bugs, fileBug, closeBug } = usePlatform()
  const [featureId, setFeatureId] = useState('')
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('low')

  const nameOf = (id: number) => features.find((f) => f.id === id)?.name ?? ''

  return (
    <section aria-label="Bugs view">
      <h1>Bugs</h1>
      <select
        aria-label="Feature"
        value={featureId}
        onChange={(e) => setFeatureId(e.target.value)}
      >
        <option value="">Select a feature</option>
        {features.map((f) => (
          <option key={f.id} value={String(f.id)}>
            {f.name}
          </option>
        ))}
      </select>
      <input aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select
        aria-label="Severity"
        value={severity}
        onChange={(e) => setSeverity(e.target.value as Severity)}
      >
        {SEVERITIES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          fileBug(featureId, title, severity)
          setTitle('')
        }}
      >
        File bug
      </button>
      <ul>
        {bugs.map((b) => (
          <li key={b.id}>
            <span>{`${b.title} [${b.severity}] - ${b.open ? 'open' : 'closed'} (${nameOf(
              b.featureId,
            )})`}</span>
            {b.open && <button onClick={() => closeBug(b.id)}>Close</button>}
          </li>
        ))}
      </ul>
    </section>
  )
}
