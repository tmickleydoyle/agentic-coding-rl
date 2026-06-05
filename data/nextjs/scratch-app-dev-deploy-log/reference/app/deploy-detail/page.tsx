'use client'
import { useDeployments } from '../../components/AppStateProvider'
import { TIMELINE_STAGES, type DeployStatus } from '../../lib/types'

const STAGE_RANK: Record<DeployStatus, number> = {
  queued: 0,
  building: 1,
  success: 2,
  failed: 1,
  rolled_back: 1,
}

function reached(stage: DeployStatus, status: DeployStatus): boolean {
  const stageRank = TIMELINE_STAGES.indexOf(stage)
  if (status === 'failed' || status === 'rolled_back') {
    // reached queued + building but not success
    return stageRank <= 1
  }
  return stageRank <= STAGE_RANK[status]
}

export default function DeployDetailPage() {
  const { deployments, selectedId, rollback } = useDeployments()

  if (!selectedId) {
    return (
      <section data-testid="page-deploy-detail">
        <p data-testid="no-selection">Select a deployment to see its detail.</p>
      </section>
    )
  }

  const deployment = deployments.find((d) => d.id === selectedId)
  if (!deployment) {
    return (
      <section data-testid="page-deploy-detail">
        <p data-testid="no-selection">Deployment not found.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-deploy-detail">
      <h2 data-testid="detail-service">{deployment.service}</h2>
      <p data-testid="detail-env">{deployment.env}</p>
      <p data-testid="detail-status">{deployment.status}</p>
      <ul data-testid="timeline">
        {TIMELINE_STAGES.map((stage) => (
          <li
            key={stage}
            data-testid={`stage-${stage}`}
            data-reached={reached(stage, deployment.status) ? 'true' : 'false'}
          >
            {stage}
          </li>
        ))}
      </ul>
      <button data-testid="rollback-detail" onClick={() => rollback(deployment.id)}>
        Roll back
      </button>
    </section>
  )
}
