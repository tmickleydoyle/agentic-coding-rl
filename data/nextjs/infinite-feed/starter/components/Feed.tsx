'use client'
import type { Loader } from './types'
import { useFeed } from '../hooks/useFeed'
import PostView from './PostView'

// TODO: render <ul data-testid="feed"> of <PostView> per item; <button data-testid="load-more">
// (onClick -> loadMore, disabled while loading or !hasMore); <span data-testid="loading"> only while
// loading; <span data-testid="end"> only when !hasMore; <span data-testid="error">{error}</span>
// only when error is non-null.
export default function Feed({ load }: { load: Loader }) {
  const { items } = useFeed(load)
  return (
    <div>
      <ul data-testid="feed" />
      <button data-testid="load-more">Load more</button>
    </div>
  )
}
