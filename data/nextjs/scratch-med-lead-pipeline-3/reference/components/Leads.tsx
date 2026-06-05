'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Stage, StageFilter } from '../lib/types'

const STAGES: Stage[] = ['new', 'demo', 'won']
const FILTER_OPTIONS: StageFilter[] = ['All', 'new', 'demo', 'won']

export function Leads() {
  const { leads, filter, setFilter, addLead, deleteLead } = useApp()
  const [company, setCompany] = useState('')
  const [stage, setStage] = useState<Stage>('new')
  const [value, setValue] = useState('')

  const visible = filter === 'All' ? leads : leads.filter((l) => l.stage === filter)

  return (
    <section aria-label="Leads view">
      <h1>Leads</h1>
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
            addLead(company, stage, Number(value))
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
          onChange={(e) => setFilter(e.target.value as StageFilter)}
        >
          {FILTER_OPTIONS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <h2>{`Showing ${visible.length} leads`}</h2>
      <ul>
        {visible.map((lead) => (
          <li key={lead.id}>
            <span>{lead.company}</span>
            <span>{lead.stage}</span>
            <span>{`$${lead.value}`}</span>
            <button aria-label={`Delete ${lead.company}`} onClick={() => deleteLead(lead.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
