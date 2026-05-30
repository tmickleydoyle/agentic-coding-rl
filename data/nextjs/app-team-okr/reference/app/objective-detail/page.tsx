'use client'
import { useApp } from '../../components/AppStateProvider'
import { objectiveProgress } from '../../lib/progress'

export default function ObjectiveDetailPage() {
  const { objectives, selectedId, updateProgress } = useApp()
  const objective = objectives.find((o) => o.id === selectedId)

  if (!objective) {
    return (
      <section data-testid="page-objective-detail">
        <p data-testid="no-objective">No objective selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-objective-detail">
      <h1 data-testid="detail-title">{objective.title}</h1>
      <span data-testid="detail-progress">{objectiveProgress(objective)}</span>
      <ul data-testid="kr-list">
        {objective.keyResults.map((kr) => (
          <li key={kr.id} data-testid={`kr-${kr.id}`}>
            <span data-testid={`kr-${kr.id}-title`}>{kr.title}</span>
            <span data-testid={`kr-${kr.id}-progress`}>{kr.progress}</span>
            <input
              type="range"
              min="0"
              max="100"
              data-testid={`kr-${kr.id}-input`}
              value={kr.progress}
              onChange={(e) => updateProgress(objective.id, kr.id, Number(e.target.value))}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
