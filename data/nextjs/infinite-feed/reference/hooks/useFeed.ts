import { useRef, useState } from 'react'
import type { Loader, Post } from '../components/types'

export function useFeed(load: Loader) {
  const [items, setItems] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pageRef = useRef(0)
  // guard against double-invocation when loading hasn't flushed to state yet
  const inFlight = useRef(false)

  const loadMore = () => {
    if (inFlight.current || loading || !hasMore) return
    inFlight.current = true
    setLoading(true)
    setError(null)
    const page = pageRef.current
    load(page)
      .then((res) => {
        setItems((prev) => {
          const seen = new Set(prev.map((p) => p.id))
          const additions = res.items.filter((p) => !seen.has(p.id))
          return [...prev, ...additions]
        })
        setHasMore(res.hasMore)
        pageRef.current = page + 1
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : String(e))
      })
      .finally(() => {
        inFlight.current = false
        setLoading(false)
      })
  }

  return { items, loading, hasMore, error, loadMore }
}
