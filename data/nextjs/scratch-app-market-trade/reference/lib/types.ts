export type Status = 'pending' | 'accepted' | 'declined'

export type Item = {
  id: string
  name: string
  owner: string
}

export type Offer = {
  id: string
  itemId: string
  offeredBy: string
  give: string
  status: Status
}

export type StatusFilter = 'all' | Status

export type Route = 'items' | 'detail' | 'offers' | 'mytrades'
export type Theme = 'light' | 'dark'

export const ME = 'me'
export const STATUSES: Status[] = ['pending', 'accepted', 'declined']
