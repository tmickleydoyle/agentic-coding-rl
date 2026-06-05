export type Platform = 'Twitter' | 'Instagram' | 'LinkedIn'
export type Status = 'draft' | 'scheduled' | 'published'
export type Route = 'content' | 'stats' | 'settings'
export type ContentItem = { id: number; title: string; platform: Platform; status: Status }
