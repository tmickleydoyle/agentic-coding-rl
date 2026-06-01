'use client'
import { usePipeline } from '../../hooks/usePipeline'
import type { Stage } from '../../lib/types'

const LABELS: Record<Stage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
}

export default function ForecastPage() {
  const { totals, winRate, openValue } = usePipeline()
  return (
    <section data-testid="page-forecast">
      <h1>Forecast</h1>
      <p data-testid="win-rate">{winRate}</p>
      <p data-testid="open-value">{openValue}</p>
      <ul data-testid="forecast-list">
        {totals.map((t) => (
          <li key={t.stage} data-testid={`forecast-${t.stage}`}>
            <span data-testid={`forecast-${t.stage}-label`}>{LABELS[t.stage]}</span>
            <span data-testid={`forecast-${t.stage}-count`}>{t.count}</span>
            <span data-testid={`forecast-${t.stage}-value`}>{t.value}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
