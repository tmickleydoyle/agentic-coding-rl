'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Stage } from '../lib/types'

const STAGES: Stage[] = ['intro', 'pitched', 'committed']

export function Investors() {
  const { investors, addInvestor, updateStage, removeInvestor } = useApp()
  const [firm, setFirm] = useState('')
  const [stage, setStage] = useState<Stage>('intro')
  const [checkSize, setCheckSize] = useState('')
  const [filter, setFilter] = useState<'All' | Stage>('All')

  const visible = filter === 'All' ? investors : investors.filter((inv) => inv.stage === filter)

  return (
    <section aria-label="Investors view">
      <h1>Investors</h1>
      <div>
        <input
          aria-label="Firm"
          value={firm}
          onChange={(e) => setFirm(e.target.value)}
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
          aria-label="Check size"
          type="number"
          value={checkSize}
          onChange={(e) => setCheckSize(e.target.value)}
        />
        <button
          onClick={() => {
            const n = parseInt(checkSize, 10)
            addInvestor(firm, stage, n)
            setFirm('')
            setStage('intro')
            setCheckSize('')
          }}
        >
          Add investor
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by stage"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | Stage)}
        >
          <option value="All">All</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${visible.length}`}</p>
      <ul>
        {visible.map((inv) => (
          <li key={inv.id}>
            <span>{inv.firm}</span>
            <span>{inv.stage}</span>
            <span>{`$${inv.checkSize}`}</span>
            <select
              aria-label={`Edit stage ${inv.firm}`}
              value={inv.stage}
              onChange={(e) => updateStage(inv.id, e.target.value as Stage)}
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button aria-label={`Remove ${inv.firm}`} onClick={() => removeInvestor(inv.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
