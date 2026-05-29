export type Post = { id: number; title: string }
export type Loader = (
  page: number
) => Promise<{ items: Post[]; hasMore: boolean }>
