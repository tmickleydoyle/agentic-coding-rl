export type Plan = 'starter' | 'pro' | 'enterprise'
export type Route = 'subscribers' | 'dashboard' | 'settings'
export type Subscriber = { id: number; name: string; plan: Plan; active: boolean }
