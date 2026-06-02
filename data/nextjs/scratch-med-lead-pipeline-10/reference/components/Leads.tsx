'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Stage } from '../lib/types'

const STAGES: Stage[] = ['new', 'demo', 'won']

export function Leads() {
  const { leads, filter, addLead, deleteLead, setFilter } = useApp()
  const [company, setCompany] = useState('')
  const [stage, setStage] = useState<Stage>('new')
  const [dealValue, setDealValue] = useState('')

  const visible = filter === 'all' ? leads : leads.filter((l) => l.stage === filter)

  return (
    <section aria-label="Leads view">
      <h1>Leads</h1>
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
          value={dealValue}
          onChange={(e) => setDealValue(e.target.value)}
        />
        <button
          onClick={() => {
            const v = parseFloat(dealValue)
            addLead(company, stage, v)
            setCompany('')
            setDealValue('')
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
      <p>{`Showing: ${visible.length} leads`}</p>
      <ul>
        {visible.map((lead) => (
          <li key={lead.id}>
            <span>{lead.company}</span>
            <span>{lead.stage}</span>
            <span>{`$${lead.dealValue.toFixed(2)}`}</span>
            <button aria-label={`Delete ${lead.company}`} onClick={() => deleteLead(lead.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
