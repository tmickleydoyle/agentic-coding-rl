export type Plan = {
  id: string
  label: string
  shortLabel: string
  price: number
}

export const PLANS: Plan[] = [
  { id: 'starter', label: 'Starter – $29/mo', shortLabel: 'Starter', price: 29 },
  { id: 'growth', label: 'Growth – $79/mo', shortLabel: 'Growth', price: 79 },
  { id: 'pro', label: 'Pro – $149/mo', shortLabel: 'Pro', price: 149 },
]
