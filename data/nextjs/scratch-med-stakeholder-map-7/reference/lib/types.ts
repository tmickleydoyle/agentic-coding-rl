export type Influence = 'High' | 'Med' | 'Low'
export type Route = 'stakeholders' | 'summary' | 'settings'
export type Stakeholder = {
  id: number
  name: string
  influence: Influence
  supportive: boolean
}
