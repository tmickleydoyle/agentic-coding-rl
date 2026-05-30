'use client'
import { useDeployments } from '../../components/AppStateProvider'
import { statusCounts, successRate } from '../../hooks/useDeployStats'
import { STATUSES } from '../../lib/types'

export default function StatsPage() {
  const { deployments } = useDeployments()
  const counts = statusCounts(deployments)
  const rate = successRate(deployments)
  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <div data-testid="stat-total">
        <span data-testid="stat-total-value">{deployments.length}</span>
      </div>
      <div data-testid="stat-success-rate">
        <span data-testid="stat-success-rate-value">{Math.round(rate * 100)}</span>
      </div>
      <ul data-testid="status-counts">
        {STATUSES.map((s) => (
          <li key={s} data-testid={`status-count-${s}`}>
            <span data-testid={`status-count-${s}-name`}>{s}</span>
            <span data-testid={`status-count-${s}-value`}>{counts[s]}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
