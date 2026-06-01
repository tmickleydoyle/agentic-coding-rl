'use client'
import { useApp } from '../../components/AppStateProvider'
import { useFunnel } from '../../hooks/useFunnel'
import { countFor } from '../../hooks/useFunnel'

export default function StepsPage() {
  const { steps, segment, selectedStepId } = useApp()
  const { rows } = useFunnel()
  const selected = steps.find((s) => s.id === selectedStepId)
  return (
    <section data-testid="page-steps">
      <h1>Steps</h1>
      <ul data-testid="step-list">
        {rows.map((r) => (
          <li key={r.id} data-testid={`step-${r.id}`}>
            <span data-testid={`step-${r.id}-name`}>{r.name}</span>
            <span data-testid={`step-${r.id}-conversion`}>{r.conversion}</span>
          </li>
        ))}
      </ul>
      {selected ? (
        <div data-testid="step-detail">
          <span data-testid="detail-name">{selected.name}</span>
          <span data-testid="detail-count">{countFor(selected, segment)}</span>
        </div>
      ) : null}
    </section>
  )
}
