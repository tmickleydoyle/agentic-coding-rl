import type { PlanKey } from './types'

export const PLANS: Record<PlanKey, { label: string; shortLabel: string; price: number }> = {
  starter: { label: 'Starter ($29/mo)', shortLabel: 'Starter', price: 29 },
  pro: { label: 'Pro ($79/mo)', shortLabel: 'Pro', price: 79 },
  enterprise: { label: 'Enterprise ($199/mo)', shortLabel: 'Enterprise', price: 199 },
}

export const PLAN_KEYS: PlanKey[] = ['starter', 'pro', 'enterprise']
