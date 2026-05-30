export type LeadStatus = 'new' | 'qualified' | 'converted' | 'lost'

export type Lead = {
  id: string
  name: string
  source: string
  score: number
  status: LeadStatus
}

export type Deal = {
  id: string
  leadId: string
  title: string
  value: number
}

export type StatusFilter = 'all' | LeadStatus
export type Route = 'leads' | 'lead-detail' | 'qualify' | 'converted'
export type Theme = 'light' | 'dark'
