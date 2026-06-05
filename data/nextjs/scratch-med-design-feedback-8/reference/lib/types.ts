export type Status = 'open' | 'addressed'
export type Route = 'feedback' | 'summary' | 'settings'
export type FeedbackItem = {
  id: number
  note: string
  screen: string
  status: Status
}
