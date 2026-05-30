export type CampaignStatus = 'draft' | 'sent'

export type Campaign = {
  id: string
  subject: string
  body: string
  status: CampaignStatus
  recipients: number
  opens: number
}

export type Subscriber = {
  id: string
  email: string
  active: boolean
}

export type StatusFilter = 'all' | CampaignStatus

export type Route = 'dashboard' | 'campaigns' | 'subscribers' | 'compose'
export type Theme = 'light' | 'dark'
