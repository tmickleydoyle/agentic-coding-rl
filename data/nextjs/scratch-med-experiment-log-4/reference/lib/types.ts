export type Route = 'experiments' | 'stats' | 'settings'
export type Experiment = {
  id: number
  name: string
  status: 'running' | 'done'
  winner: 'A' | 'B' | null
}
