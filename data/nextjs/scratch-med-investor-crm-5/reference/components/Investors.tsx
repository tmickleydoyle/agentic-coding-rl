'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Stage } from '../lib/types'

const STAGES: Stage[] = ['intro', 'pitched', 'committed']

export function Investors() {
  const { investors, filter, addInvestor, removeInvestor, setFilter } = useApp()
  const [firm, setFirm] = useState('')
  const [stage, setStage] = useState<Stage>('intro')
  const [checkSize, setCheckSize] = useState('')

  const visible = filter === 'All' ? investors : investors.filter((inv) => inv.stage === filter)

  function handleAdd() {
    const size = Number(checkSize)
    addInvestor(firm, stage, size)
    setFirm('')
    setStage('intro')
    setCheckSize('')
  }

  return (
    <section aria-label="Investors view">
      <h1>{`Investors (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Firm name"
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
        <button onClick={handleAdd}>Add investor</button>
      </div>
      <div>
        <select
          aria-label="Filter by stage"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Stage | 'All')}
        >
          <option value="All">All</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((inv) => (
          <li key={inv.id}>
            <span>{inv.firm}</span>
            <span>{inv.stage}</span>
            <span>{`$${inv.checkSize}`}</span>
            <button aria-label={`Remove ${inv.firm}`} onClick={() => removeInvestor(inv.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
