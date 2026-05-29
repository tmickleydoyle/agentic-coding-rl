import { useState } from 'react'
import type { Loader, Post } from '../components/types'

// TODO: return { items, loading, hasMore, error, loadMore }. loadMore: no-op while loading or
// !hasMore; else set loading, call load(nextPage) starting at 0; on resolve append items deduped
// by id, set hasMore, advance page, clear loading; on reject set error=message, clear loading
// (do not advance page).
export function useFeed(load: Loader) {
  const [items, setItems] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  return { items, loading, hasMore, error, loadMore: () => {} }
}
