export type Platform = 'Twitter' | 'Instagram' | 'LinkedIn'
export type Status = 'draft' | 'scheduled' | 'published'
export type Route = 'posts' | 'stats' | 'settings'
export type Post = { id: number; title: string; platform: Platform; status: Status }
