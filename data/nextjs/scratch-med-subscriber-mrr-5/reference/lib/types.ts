export type PlanKey = 'starter' | 'pro' | 'enterprise'
export type Route = 'subscribers' | 'dashboard' | 'settings'
export type Subscriber = {
  id: number
  name: string
  plan: PlanKey
  active: boolean
}
