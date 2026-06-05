'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Stage } from '../lib/types'

const STAGES: Stage[] = ['new', 'demo', 'won']

export function Leads() {
  const { leads, addLead, deleteLead, stageFilter, setStageFilter } = useApp()
  const [company, setCompany] = useState('')
  const [stage, setStage] = useState<Stage>('new')
  const [value, setValue] = useState('')

  const visible = stageFilter === 'all' ? leads : leads.filter((l) => l.stage === stageFilter)

  function handleAdd() {
    const v = parseFloat(value)
    addLead(company, stage, v)
    setCompany('')
    setValue('')
    setStage('new')
  }

  return (
    <section aria-label="Leads view">
      <h1>{`Leads (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
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
        <input
          aria-label="Deal Value"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={handleAdd}>Add Lead</button>
      </div>
      <div>
        <select
          aria-label="Filter by stage"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as Stage | 'all')}
        >
          <option value="all">all</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((lead) => (
          <li key={lead.id}>
            <span>{lead.company}</span>
            <span>{lead.stage}</span>
            <span>{`$${lead.value}`}</span>
            <button
              aria-label={`Delete ${lead.company}`}
              onClick={() => deleteLead(lead.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
