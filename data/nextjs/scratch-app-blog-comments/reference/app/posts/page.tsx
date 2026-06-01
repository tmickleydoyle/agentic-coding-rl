'use client'
import { useApp } from '../../components/AppStateProvider'
import { useComments } from '../../hooks/useComments'

export default function PostsPage() {
  const { posts, openPost } = useApp()
  const { counts } = useComments()
  return (
    <section data-testid="page-posts">
      <h1>Posts</h1>
      <ul data-testid="post-list">
        {posts.map((p) => (
          <li key={p.id} data-testid={`post-${p.id}`}>
            <span data-testid={`post-${p.id}-title`}>{p.title}</span>
            <span data-testid={`post-${p.id}-count`}>{counts.byPost[p.id] ?? 0}</span>
            <button data-testid={`open-${p.id}`} onClick={() => openPost(p.id)}>
              View comments
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
