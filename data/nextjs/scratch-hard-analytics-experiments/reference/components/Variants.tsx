'use client'
import { useState } from 'react'
import { useExperiments } from '../hooks/useExperiments'
import { rate } from '../lib/types'

export function Variants() {
  const { experiments, variants, addVariant } = useExperiments()
  const [experimentId, setExperimentId] = useState('')
  const [name, setName] = useState('')
  const [visitors, setVisitors] = useState('')
  const [conversions, setConversions] = useState('')

  return (
    <section aria-label="Variants view">
      <h1>Variants</h1>
      <select
        aria-label="Experiment"
        value={experimentId}
        onChange={(e) => setExperimentId(e.target.value)}
      >
        <option value="">Select experiment</option>
        {experiments.map((exp) => (
          <option key={exp.id} value={String(exp.id)}>
            {exp.name}
          </option>
        ))}
      </select>
      <input aria-label="Variant name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        aria-label="Visitors"
        type="number"
        value={visitors}
        onChange={(e) => setVisitors(e.target.value)}
      />
      <input
        aria-label="Conversions"
        type="number"
        value={conversions}
        onChange={(e) => setConversions(e.target.value)}
      />
      <button
        onClick={() => {
          addVariant(experimentId, name, visitors, conversions)
          setName('')
          setVisitors('')
          setConversions('')
        }}
      >
        Add variant
      </button>
      <ul>
        {variants.map((v) => (
          <li key={v.id}>
            {`${v.name}: ${v.conversions}/${v.visitors} (${rate(v.visitors, v.conversions)}%)`}
          </li>
        ))}
      </ul>
    </section>
  )
}
