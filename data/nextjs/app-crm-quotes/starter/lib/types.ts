export type LineItem = {
  description: string
  qty: number
  price: number
}

export type Status = 'draft' | 'sent' | 'accepted' | 'rejected'

export type Quote = {
  id: string
  client: string
  status: Status
  items: LineItem[]
}

export type StatusFilter = 'all' | Status

export type Route = 'quotes' | 'quote-detail' | 'new' | 'accepted'
export type Theme = 'light' | 'dark'

export const STATUSES: Status[] = ['draft', 'sent', 'accepted', 'rejected']
