export type PostStatus = 'draft' | 'scheduled' | 'published'
export type Platform = 'Twitter' | 'LinkedIn' | 'Instagram'
export type Route = 'posts' | 'stats' | 'settings'
export type Post = { id: number; title: string; platform: Platform; status: PostStatus }
