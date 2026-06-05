export type DeployStatus = 'queued' | 'building' | 'success' | 'failed' | 'rolled_back'

export type Deployment = {
  id: string
  env: string
  service: string
  status: DeployStatus
  createdAt: number
}

export type EnvFilter = 'all' | string

export type Route = 'deployments' | 'deploy-detail' | 'environments' | 'stats'
export type Theme = 'light' | 'dark'

export const STATUSES: DeployStatus[] = ['queued', 'building', 'success', 'failed', 'rolled_back']
export const TIMELINE_STAGES: DeployStatus[] = ['queued', 'building', 'success']
