export type Cohort = {
  id: string
  month: string
  size: number
  retention: number[]
}

export type SizeFilter = 'all' | 'large'

export type Route = 'cohorts' | 'retention' | 'breakdown' | 'settings'
export type Theme = 'light' | 'dark'

export const PERIODS: string[] = ['M0', 'M1', 'M2', 'M3']
