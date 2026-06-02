export type Route = 'blasts' | 'lists' | 'overview' | 'settings'
export const ROUTES: Route[] = ['blasts', 'lists', 'overview', 'settings']

export type Blast = {
  id: number
  subject: string
  list: string
  sent: number
  opens: number
  clicks: number
}

export const LISTS = ['Newsletter', 'Onboarding', 'Promotions', 'Winback']
