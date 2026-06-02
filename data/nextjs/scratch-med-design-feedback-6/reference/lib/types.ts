export type Status = 'open' | 'addressed'
export type Route = 'feedback' | 'stats' | 'settings'
export type FeedbackItem = { id: number; note: string; screen: string; status: Status }
