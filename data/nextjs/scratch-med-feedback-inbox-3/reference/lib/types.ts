export type Theme = 'Bug' | 'Feature' | 'UX'
export type SortOrder = 'newest' | 'most-upvoted'
export type Route = 'inbox' | 'stats' | 'settings'
export type FeedbackItem = { id: number; note: string; theme: Theme; upvotes: number }
