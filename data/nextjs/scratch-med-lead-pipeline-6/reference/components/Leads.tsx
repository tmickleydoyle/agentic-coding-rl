'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Stage } from '../lib/types'

const STAGE_OPTIONS: Stage[] = ['new', 'demo', 'won']
const FILTER_BUTTONS: Array<{ value: Stage | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'demo', label: 'Demo' },
  { value: 'won', label: 'Won' },
]

export function Leads() {
  const { leads, filter, setFilter, addLead, deleteLead } = useApp()
  const [company, setCompany] = useState('')
  const [stage, setStage] = useState<Stage>('new')
  const [dealValue, setDealValue] = useState('')

  const visible = filter === 'all' ? leads : leads.filter((l) => l.stage === filter)
  const headingLabel =
    filter === 'all'
      ? `All Leads (${visible.length})`
      : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Leads (${visible.length})`

  function handleAdd() {
    const v = parseInt(dealValue, 10)
    addLead(company, stage, v)
    setCompany('')
    setStage('new')
    setDealValue('')
  }

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
          {STAGE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          aria-label="Deal Value"
          type="number"
          value={dealValue}
          onChange={(e) => setDealValue(e.target.value)}
        />
        <button onClick={handleAdd}>Add Lead</button>
      </div>
      <div>
        {FILTER_BUTTONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
          >
            {label}
          </button>
        ))}
      </div>
      <h2>{headingLabel}</h2>
      <ul>
        {visible.map((l) => (
          <li key={l.id}>
            <span>{l.company}</span>
            <span>{l.stage}</span>
            <span>{`$${l.value}`}</span>
            <button aria-label={`Delete ${l.company}`} onClick={() => deleteLead(l.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
