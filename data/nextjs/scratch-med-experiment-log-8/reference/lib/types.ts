export type Status = 'running' | 'done'
export type Filter = 'All' | 'Running' | 'Done'
export type Route = 'experiments' | 'stats' | 'settings'
export type Experiment = {
  id: number
  name: string
  status: Status
  winner: 'A' | 'B' | null
}
