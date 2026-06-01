export type Stage = 'lead' | 'qualified' | 'proposal' | 'won' | 'lost'

export type Contact = {
  id: string
  name: string
  company: string
}

export type Deal = {
  id: string
  title: string
  value: number
  stage: Stage
  contactId: string
}

export type Route = 'pipeline' | 'deal-detail' | 'contacts' | 'forecast'
export type Theme = 'light' | 'dark'
