'use client'
import { useOnboarding } from '../../hooks/useOnboarding'

export default function ProgressPage() {
  const { progress } = useOnboarding()
  const overall =
    progress.length === 0
      ? 0
      : Math.round(progress.reduce((sum, p) => sum + p.percent, 0) / progress.length)
  return (
    <section data-testid="page-progress">
      <h1>Progress</h1>
      <span data-testid="overall-percent">{overall}</span>
      <ul data-testid="progress-list">
        {progress.map((p) => (
          <li key={p.hire.id} data-testid={`progress-${p.hire.id}`}>
            <span data-testid={`progress-${p.hire.id}-name`}>{p.hire.name}</span>
            <span data-testid={`progress-${p.hire.id}-done`}>{p.done}</span>
            <span data-testid={`progress-${p.hire.id}-total`}>{p.total}</span>
            <span data-testid={`progress-${p.hire.id}-percent`}>{p.percent}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
