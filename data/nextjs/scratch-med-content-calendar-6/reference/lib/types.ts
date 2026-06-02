export type Platform = 'Twitter' | 'Instagram' | 'LinkedIn' | 'Blog'
export type Status = 'Draft' | 'Scheduled' | 'Published'
export type Route = 'calendar' | 'stats' | 'settings'
export type ContentItem = { id: number; title: string; platform: Platform; status: Status }
