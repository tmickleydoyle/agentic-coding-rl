'use client'
import type { Deployment } from '../lib/types'

export default function DeployRow({
  deployment,
  onView,
  onRollback,
}: {
  deployment: Deployment
  onView: (id: string) => void
  onRollback: (id: string) => void
}) {
  return (
    <li data-testid={`deploy-${deployment.id}`} data-status={deployment.status}>
      <span data-testid={`deploy-${deployment.id}-service`}>{deployment.service}</span>
      <span data-testid={`deploy-${deployment.id}-env`}>{deployment.env}</span>
      <span data-testid={`deploy-${deployment.id}-status`}>{deployment.status}</span>
      <button data-testid={`view-${deployment.id}`} onClick={() => onView(deployment.id)}>
        View
      </button>
      <button data-testid={`rollback-${deployment.id}`} onClick={() => onRollback(deployment.id)}>
        Roll back
      </button>
    </li>
  )
}
