export type Status = 'planned' | 'in-progress' | 'done'

export type Quarter = {
  id: string
  label: string
}

export type Initiative = {
  id: string
  title: string
  quarterId: string
  status: Status
}

export type Route = 'roadmap' | 'initiative-detail' | 'add' | 'timeline'
export type Theme = 'light' | 'dark'

export const QUARTER_ORDER = ['q1', 'q2', 'q3', 'q4']
