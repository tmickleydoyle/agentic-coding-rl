'use client'
import { useDeployments } from '../components/AppStateProvider'
import type { Deployment, DeployStatus, EnvFilter } from '../lib/types'

export function environments(deployments: Deployment[]): string[] {
  const set = new Set<string>()
  deployments.forEach((d) => set.add(d.env))
  return Array.from(set).sort()
}

export function byEnv(deployments: Deployment[]): Record<string, number> {
  const out: Record<string, number> = {}
  deployments.forEach((d) => {
    out[d.env] = (out[d.env] ?? 0) + 1
  })
  return out
}

export function statusCounts(deployments: Deployment[]): Record<DeployStatus, number> {
  const out: Record<DeployStatus, number> = {
    queued: 0,
    building: 0,
    success: 0,
    failed: 0,
    rolled_back: 0,
  }
  deployments.forEach((d) => {
    out[d.status] += 1
  })
  return out
}

export function successRate(deployments: Deployment[]): number {
  if (deployments.length === 0) return 0
  const ok = deployments.filter((d) => d.status === 'success').length
  return ok / deployments.length
}

export function filterByEnv(deployments: Deployment[], envFilter: EnvFilter): Deployment[] {
  return deployments.filter((d) => envFilter === 'all' || d.env === envFilter)
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
