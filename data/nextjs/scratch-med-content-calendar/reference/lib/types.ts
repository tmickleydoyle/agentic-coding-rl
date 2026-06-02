export type Platform = 'Twitter' | 'Instagram' | 'LinkedIn' | 'Blog'
export type PostStatus = 'Draft' | 'Scheduled' | 'Published'
export type Route = 'calendar' | 'stats' | 'settings'
export type Post = { id: number; title: string; platform: Platform; status: PostStatus }
