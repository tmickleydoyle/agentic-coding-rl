'use client'
import { useProfile } from '../../hooks/useProfile'
import PostItem from '../../components/PostItem'

export default function PostsPage() {
  const { myPosts } = useProfile()
  return (
    <section data-testid="page-posts">
      <h1>Posts</h1>
      {myPosts.length === 0 ? (
        <p data-testid="empty-posts">No posts yet.</p>
      ) : (
        <ul data-testid="post-list">
          {myPosts.map((p) => (
            <PostItem key={p.id} post={p} />
          ))}
        </ul>
      )}
    </section>
  )
}
