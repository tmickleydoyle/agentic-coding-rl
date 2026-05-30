'use client'
import { useApp } from '../../components/AppStateProvider'
import { useFunnel } from '../../hooks/useFunnel'
import FunnelRow from '../../components/FunnelRow'
import type { Segment } from '../../lib/types'

export default function FunnelPage() {
  const { segment, setSegment, selectStep } = useApp()
  const { rows, overall } = useFunnel()
  return (
    <section data-testid="page-funnel">
      <h1>Funnel</h1>
      <select
        data-testid="segment-filter"
        value={segment}
        onChange={(e) => setSegment(e.target.value as Segment)}
      >
        <option value="all">All</option>
        <option value="mobile">Mobile</option>
        <option value="desktop">Desktop</option>
      </select>
      <ul data-testid="funnel-rows">
        {rows.map((r) => (
          <FunnelRow key={r.id} row={r} onSelect={selectStep} />
        ))}
      </ul>
      <span data-testid="overall-conversion">{overall}</span>
    </section>
  )
}
