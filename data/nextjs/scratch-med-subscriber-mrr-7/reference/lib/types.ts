export type Plan = 'Basic' | 'Pro' | 'Enterprise'
export type Route = 'subscribers' | 'dashboard' | 'settings'
export type Subscriber = { id: number; name: string; plan: Plan; active: boolean }

export const PLAN_PRICE: Record<Plan, number> = {
  Basic: 9,
  Pro: 29,
  Enterprise: 99,
}
