export type ExperimentStatus = 'running' | 'done'
export type FilterOption = 'All' | 'Running' | 'Done'
export type Route = 'experiments' | 'stats' | 'settings'
export type Experiment = {
  id: number
  name: string
  status: ExperimentStatus
  winner: 'A' | 'B' | null
}
