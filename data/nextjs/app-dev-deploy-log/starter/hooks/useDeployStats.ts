'use client'
import { useDeployments } from '../components/AppStateProvider'
import type { Deployment, DeployStatus, EnvFilter } from '../lib/types'

export function environments(_deployments: Deployment[]): string[] {
  // TODO: distinct env names, sorted
  return []
}

export function byEnv(_deployments: Deployment[]): Record<string, number> {
  // TODO: deploy counts per env
  return {}
}

export function statusCounts(_deployments: Deployment[]): Record<DeployStatus, number> {
  // TODO: counts per status
  return { queued: 0, building: 0, success: 0, failed: 0, rolled_back: 0 }
}

export function successRate(_deployments: Deployment[]): number {
  // TODO: fraction with status success
  return 0
}

export function filterByEnv(_deployments: Deployment[], _envFilter: EnvFilter): Deployment[] {
  // TODO: apply env filter
  return []
}

export function useDeployStats() {
  const { deployments, envFilter } = useDeployments()
  const counts = statusCounts(deployments)
  const rate = successRate(deployments)
  const byEnvCounts = byEnv(deployments)
  const filtered = filterByEnv(deployments, envFilter)
  const envs = environments(deployments)
  return { counts, rate, byEnvCounts, filtered, envs }
}
