'use client'
import { useApp } from '../../components/AppStateProvider'

export default function WritingPage() {
  const { posts } = useApp()
  return (
    <section data-testid="page-writing">
      <h1>Writing</h1>
      <ul data-testid="post-list">
        {posts.map((p) => (
          <li key={p.id} data-testid={`post-${p.id}`}>
            <span data-testid={`post-${p.id}-title`}>{p.title}</span>
            <span data-testid={`post-${p.id}-tag`}>{p.tag}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
