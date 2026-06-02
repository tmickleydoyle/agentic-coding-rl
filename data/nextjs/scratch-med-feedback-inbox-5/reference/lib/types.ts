export type Theme = 'Bug' | 'Feature' | 'UX' | 'Other'
export type Route = 'inbox' | 'stats' | 'settings'
export type FeedbackEntry = {
  id: number
  note: string
  theme: Theme
  upvotes: number
}
