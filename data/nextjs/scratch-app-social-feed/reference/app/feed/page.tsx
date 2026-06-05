'use client'
import { useApp } from '../../components/AppStateProvider'
import { useFeed } from '../../hooks/useFeed'
import PostCard from '../../components/PostCard'
import type { FeedFilter } from '../../lib/types'

export default function FeedPage() {
  const { users, feedFilter, setFeedFilter, toggleLike, openPost, openProfile } = useApp()
  const { visiblePosts } = useFeed()

  const handle = (id: string): string =>
    users.find((u) => u.id === id)?.handle ?? '@unknown'

  return (
    <section data-testid="page-feed">
      <h1>Feed</h1>
      <label htmlFor="feed-filter">Filter</label>
      <select
        id="feed-filter"
        data-testid="feed-filter"
        value={feedFilter}
        onChange={(e) => setFeedFilter(e.target.value as FeedFilter)}
      >
        <option value="all">All</option>
        <option value="following">Following</option>
      </select>
      {visiblePosts.length === 0 ? (
        <p data-testid="empty-feed">No posts to show.</p>
      ) : (
        <ul data-testid="feed-list">
          {visiblePosts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              authorHandle={handle(p.authorId)}
              onLike={toggleLike}
              onOpen={openPost}
              onAuthor={openProfile}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
