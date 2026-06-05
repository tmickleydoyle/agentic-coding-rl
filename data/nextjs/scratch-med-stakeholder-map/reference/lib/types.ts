export type Influence = 'high' | 'med' | 'low'
export type Route = 'stakeholders' | 'summary' | 'settings'
export type Stakeholder = {
  id: number
  name: string
  influence: Influence
  supportive: boolean
}
