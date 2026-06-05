export type ItemStatus = 'draft' | 'scheduled' | 'published'
export type Platform = 'Twitter' | 'Instagram' | 'LinkedIn' | 'Blog'
export type Route = 'content' | 'stats' | 'settings'
export type ContentItem = { id: number; title: string; platform: Platform; status: ItemStatus }
