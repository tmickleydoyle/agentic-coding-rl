import type { Plan } from './types'

export const PLANS: Plan[] = ['Starter', 'Pro', 'Enterprise']

export const PLAN_PRICE: Record<Plan, number> = {
  Starter: 29,
  Pro: 99,
  Enterprise: 299,
}
