import type { Deployment, DeployStatus } from './types'

// In-memory server store for the API routes. SEPARATE from the client Context state.
// Tests call __reset() in beforeEach for isolation.

let deployments: Deployment[] = []
let nextId = 1
let nextCreatedAt = 1

function seed(): void {
  deployments = [
    { id: 'd1', env: 'prod', service: 'api', status: 'success', createdAt: 1 },
    { id: 'd2', env: 'stage', service: 'api', status: 'failed', createdAt: 2 },
    { id: 'd3', env: 'dev', service: 'web', status: 'success', createdAt: 3 },
  ]
  nextId = 4
  nextCreatedAt = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listDeployments(filter?: { env?: string | null; status?: string | null }): Deployment[] {
  let out = deployments.slice()
  const env = filter?.env
  if (env) out = out.filter((d) => d.env === env)
  const status = filter?.status
  if (status) out = out.filter((d) => d.status === status)
  return out
}

export function createDeployment(input: { env?: string; service: string }): Deployment {
  const deployment: Deployment = {
    id: `d${nextId++}`,
    env: input.env ?? 'dev',
    service: input.service,
    status: 'queued',
    createdAt: nextCreatedAt++,
  }
  deployments.push(deployment)
  return deployment
}

export function findDeployment(id: string): Deployment | undefined {
  return deployments.find((d) => d.id === id)
}

export function updateDeployment(id: string, patch: { status?: DeployStatus }): Deployment | undefined {
  const deployment = deployments.find((d) => d.id === id)
  if (!deployment) return undefined
  if (patch.status) deployment.status = patch.status
  return deployment
}

export function deleteDeployment(id: string): boolean {
  const idx = deployments.findIndex((d) => d.id === id)
  if (idx === -1) return false
  deployments.splice(idx, 1)
  return true
}

export function statsSnapshot(): {
  total: number
  byStatus: Record<DeployStatus, number>
  byEnv: Record<string, number>
  successRate: number
} {
  const byStatus: Record<DeployStatus, number> = {
    queued: 0,
    building: 0,
    success: 0,
    failed: 0,
    rolled_back: 0,
  }
  const byEnv: Record<string, number> = {}
  let successCount = 0
  deployments.forEach((d) => {
    byStatus[d.status] += 1
    byEnv[d.env] = (byEnv[d.env] ?? 0) + 1
    if (d.status === 'success') successCount += 1
  })
  const total = deployments.length
  return { total, byStatus, byEnv, successRate: total === 0 ? 0 : successCount / total }
}
