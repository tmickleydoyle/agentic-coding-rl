'use client'
import { useApp } from '../../components/AppStateProvider'
import { overallConversion } from '../../hooks/useFunnel'
import type { Segment } from '../../lib/types'

const COMPARED: Segment[] = ['mobile', 'desktop']

export default function SegmentsPage() {
  const { steps } = useApp()
  return (
    <section data-testid="page-segments">
      <h1>Segments</h1>
      <ul data-testid="segment-list">
        {COMPARED.map((seg) => (
          <li key={seg} data-testid={`seg-${seg}`}>
            <span data-testid={`seg-${seg}-name`}>{seg}</span>
            <span data-testid={`seg-${seg}-conversion`}>{overallConversion(steps, seg)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
