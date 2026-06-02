'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Stage } from '../lib/types'

const STAGES: Stage[] = ['new', 'demo', 'won']

function fmt(v: number) {
  return `$${v.toFixed(2)}`
}

export function Leads() {
  const { leads, filter, setFilter, addLead, deleteLead } = useApp()
  const [company, setCompany] = useState('')
  const [stage, setStage] = useState<Stage>('new')
  const [value, setValue] = useState('')

  const visible = filter === 'all' ? leads : leads.filter((l) => l.stage === filter)

  return (
    <section aria-label="Leads view">
      <h1>{`Leads (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          aria-label="Deal Value"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <select
          aria-label="Stage"
          value={stage}
          onChange={(e) => setStage(e.target.value as Stage)}
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addLead(company, stage, parseFloat(value))
            setCompany('')
            setValue('')
            setStage('new')
          }}
        >
          Add Lead
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by stage"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Stage | 'all')}
        >
          <option value="all">all</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((l) => (
          <li key={l.id}>
            <span>{l.company}</span>
            <span>{l.stage}</span>
            <span>{fmt(l.value)}</span>
            <button aria-label={`Delete ${l.company}`} onClick={() => deleteLead(l.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
