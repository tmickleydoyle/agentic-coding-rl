'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Stage } from '../lib/types'

export function Leads() {
  const { leads, filter, addLead, deleteLead, setFilter } = useApp()
  const [company, setCompany] = useState('')
  const [stage, setStage] = useState<Stage>('new')
  const [dealValue, setDealValue] = useState('')

  function handleAdd() {
    const val = parseInt(dealValue, 10)
    addLead(company, stage, val)
    setCompany('')
    setStage('new')
    setDealValue('')
  }

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
          <option value="new">new</option>
          <option value="demo">demo</option>
          <option value="won">won</option>
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
        <select
          aria-label="Filter by stage"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | Stage)}
        >
          <option value="all">all</option>
          <option value="new">new</option>
          <option value="demo">demo</option>
          <option value="won">won</option>
        </select>
      </div>
      <ul>
        {visible.map((lead) => (
          <li key={lead.id}>
            <span>{lead.company}</span>
            <span>{lead.stage}</span>
            <span>{`$${lead.dealValue}`}</span>
            <button aria-label={`Delete ${lead.company}`} onClick={() => deleteLead(lead.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${visible.length} leads`}</p>
    </section>
  )
}
