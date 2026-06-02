'use client'
import { useState } from 'react'
import { useExperiments } from '../hooks/useExperiments'

export function Experiments() {
  const { experiments, variants, addExperiment } = useExperiments()
  const [name, setName] = useState('')

  return (
    <section aria-label="Experiments view">
      <h1>Experiments</h1>
      <input aria-label="Experiment name" value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          addExperiment(name)
          setName('')
        }}
      >
        Add experiment
      </button>
      <ul>
        {experiments.map((exp) => {
          const count = variants.filter((v) => v.experimentId === exp.id).length
          return <li key={exp.id}>{`${exp.name} (${count} variants)`}</li>
        })}
      </ul>
    </section>
  )
}
