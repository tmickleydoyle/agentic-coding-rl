export type Kpi = {
  id: string
  name: string
  unit: string
  current: number
  previous: number
  target: number
  higherIsBetter: boolean
  history: number[]
}

export type Route = 'dashboard' | 'kpi-detail' | 'targets' | 'history'
export type Theme = 'light' | 'dark'
