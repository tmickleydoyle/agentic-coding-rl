export type LeadStatus = 'new' | 'touring' | 'offer' | 'closed'

export type Lead = {
  id: string
  name: string
  status: LeadStatus
  propertyId: string | null
}

export type Property = {
  id: string
  address: string
}

export type StatusFilter = 'all' | LeadStatus
export type Route = 'leads' | 'lead-detail' | 'properties' | 'pipeline'
export type Theme = 'light' | 'dark'

export const STATUS_ORDER: LeadStatus[] = ['new', 'touring', 'offer', 'closed']
