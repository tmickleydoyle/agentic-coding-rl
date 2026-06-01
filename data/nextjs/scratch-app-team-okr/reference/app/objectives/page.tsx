'use client'
import { useApp } from '../../components/AppStateProvider'
import { objectiveProgress } from '../../lib/progress'
import ObjectiveRow from '../../components/ObjectiveRow'

export default function ObjectivesPage() {
  const { objectives, selectObjective } = useApp()
  return (
    <section data-testid="page-objectives">
      <h1>Objectives</h1>
      <ul data-testid="objective-list">
        {objectives.map((o) => (
          <ObjectiveRow
            key={o.id}
            objective={o}
            progress={objectiveProgress(o)}
            onOpen={selectObjective}
          />
        ))}
      </ul>
    </section>
  )
}
