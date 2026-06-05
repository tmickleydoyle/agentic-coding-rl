'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Stage } from '../lib/types'

const STAGES: Stage[] = ['intro', 'pitched', 'committed']

export function Investors() {
  const { investors, addInvestor, removeInvestor } = useApp()
  const [firm, setFirm] = useState('')
  const [checkSize, setCheckSize] = useState('')
  const [stage, setStage] = useState<Stage>('intro')
  const [filter, setFilter] = useState<Stage | 'all'>('all')

  const displayed = filter === 'all' ? investors : investors.filter((inv) => inv.stage === filter)

  function handleAdd() {
    const size = parseInt(checkSize, 10)
    addInvestor(firm, size, stage)
    setFirm('')
    setCheckSize('')
    setStage('intro')
  }

  return (
    <section aria-label="Investors view">
      <h1>Investors</h1>
      <div>
        <label>
          Firm
          <input aria-label="Firm" value={firm} onChange={(e) => setFirm(e.target.value)} />
        </label>
        <label>
          Check Size
          <input
            aria-label="Check Size"
            type="number"
            value={checkSize}
            onChange={(e) => setCheckSize(e.target.value)}
          />
        </label>
        <label>
          Stage
          <select aria-label="Stage" value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <button onClick={handleAdd}>Add Investor</button>
      </div>
      <div>
        <label>
          Filter by stage
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
        </label>
      </div>
      <h2>{`Investors (${displayed.length})`}</h2>
      <ul>
        {displayed.map((inv) => (
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
