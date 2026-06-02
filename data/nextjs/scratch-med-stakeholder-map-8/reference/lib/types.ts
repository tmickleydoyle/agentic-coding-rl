export type Influence = 'High' | 'Medium' | 'Low'
export type Route = 'stakeholders' | 'summary' | 'settings'
export type Stakeholder = {
  id: number
  name: string
  influence: Influence
  supportive: boolean
}
