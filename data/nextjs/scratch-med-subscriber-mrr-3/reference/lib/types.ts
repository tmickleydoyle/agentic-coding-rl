export type Plan = 'Starter' | 'Pro' | 'Enterprise'
export type Route = 'subscribers' | 'dashboard' | 'settings'
export type Subscriber = {
  id: number
  name: string
  plan: Plan
  active: boolean
}
