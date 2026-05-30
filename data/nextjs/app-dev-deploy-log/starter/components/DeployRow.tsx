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
  // TODO: render service, env, status, a view-<id> button and a rollback-<id> button
  void onView
  void onRollback
  return <li data-testid={`deploy-${deployment.id}`} data-status={deployment.status} />
}
