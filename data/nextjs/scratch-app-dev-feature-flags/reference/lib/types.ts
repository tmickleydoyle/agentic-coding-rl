export type Env = 'dev' | 'stage' | 'prod'

export const ENVS: Env[] = ['dev', 'stage', 'prod']

export type Flag = {
  id: string
  key: string
  description: string
  envs: Record<Env, boolean>
  rollout: number
}

export type AuditEntry = {
  id: string
  flagId: string
  action: string
  env: Env | null
  createdAt: number
}

export type Route = 'flags' | 'flag-detail' | 'environments' | 'audit'
export type Theme = 'light' | 'dark'

export function clampRollout(pct: number): number {
  if (!Number.isFinite(pct)) return 0
  if (pct < 0) return 0
  if (pct > 100) return 100
  return Math.round(pct)
}
