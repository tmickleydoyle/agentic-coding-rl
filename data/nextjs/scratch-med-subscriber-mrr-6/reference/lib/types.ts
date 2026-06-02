export type Route = 'subscribers' | 'dashboard' | 'settings'
export type Subscriber = {
  id: number
  name: string
  planId: string
  active: boolean
}
