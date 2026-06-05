import type { Plan } from './types'

export const PLANS: { key: Plan; name: string; label: string; price: number }[] = [
  { key: 'starter', name: 'Starter', label: 'Starter ($29/mo)', price: 29 },
  { key: 'pro', name: 'Pro', label: 'Pro ($79/mo)', price: 79 },
  { key: 'enterprise', name: 'Enterprise', label: 'Enterprise ($199/mo)', price: 199 },
]
