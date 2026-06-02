export type ReviewStatus = 'draft' | 'approved' | 'changes'
export type Route = 'reviews' | 'stats' | 'settings'
export type ReviewItem = { id: number; title: string; reviewer: string; status: ReviewStatus }
