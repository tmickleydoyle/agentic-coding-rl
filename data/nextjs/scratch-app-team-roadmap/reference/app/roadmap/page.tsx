'use client'
import { useApp } from '../../components/AppStateProvider'
import { useRoadmap } from '../../hooks/useRoadmap'
import InitiativeCard from '../../components/InitiativeCard'

export default function RoadmapPage() {
  const { quarters, selectInitiative } = useApp()
  const { byQuarter, countByQuarter } = useRoadmap()
  return (
    <section data-testid="page-roadmap">
      <h1>Roadmap</h1>
      {quarters.map((q) => (
        <div key={q.id} data-testid={`quarter-${q.id}`}>
          <span data-testid={`quarter-${q.id}-label`}>{q.label}</span>
          <span data-testid={`quarter-${q.id}-count`}>{countByQuarter[q.id] ?? 0}</span>
          <ul data-testid={`quarter-${q.id}-list`}>
            {(byQuarter[q.id] ?? []).map((i) => (
              <InitiativeCard key={i.id} initiative={i} onOpen={selectInitiative} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
