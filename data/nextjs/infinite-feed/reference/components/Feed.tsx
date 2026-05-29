'use client'
import type { Loader } from './types'
import { useFeed } from '../hooks/useFeed'
import PostView from './PostView'

export default function Feed({ load }: { load: Loader }) {
  const { items, loading, hasMore, error, loadMore } = useFeed(load)

  return (
    <div>
      <ul data-testid="feed">
        {items.map((p) => (
          <PostView key={p.id} post={p} />
        ))}
      </ul>
      <button
        data-testid="load-more"
        onClick={loadMore}
        disabled={loading || !hasMore}
      >
        Load more
      </button>
      {loading && <span data-testid="loading">Loading…</span>}
      {!hasMore && <span data-testid="end">No more</span>}
      {error !== null && <span data-testid="error">{error}</span>}
    </div>
  )
}
