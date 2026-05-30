import type { Deployment, DeployStatus } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `deployments`, id + createdAt counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listDeployments(_filter?: { env?: string | null; status?: string | null }): Deployment[] {
  // TODO: return deployments, applying optional env + status filters
  return []
}

export function createDeployment(_input: { env?: string; service: string }): Deployment {
  // TODO: append a new deployment (status queued) with a fresh id + createdAt and return it
  return { id: '', env: '', service: '', status: 'queued', createdAt: 0 }
}

export function findDeployment(_id: string): Deployment | undefined {
  // TODO: look up a deployment by id
  return undefined
}

export function updateDeployment(_id: string, _patch: { status?: DeployStatus }): Deployment | undefined {
  // TODO: apply the patch and return the updated deployment, or undefined if absent
  return undefined
}

export function deleteDeployment(_id: string): boolean {
  // TODO: remove the deployment; return whether it existed
  return false
}

export function statsSnapshot(): {
  total: number
  byStatus: Record<DeployStatus, number>
  byEnv: Record<string, number>
  successRate: number
} {
  // TODO: compute total, per-status, per-env counts and the success rate
  return {
    total: 0,
    byStatus: { queued: 0, building: 0, success: 0, failed: 0, rolled_back: 0 },
    byEnv: {},
    successRate: 0,
  }
}
