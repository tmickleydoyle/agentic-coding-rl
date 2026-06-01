'use client'
import { useApp } from '../../components/AppStateProvider'
import { usePortfolio } from '../../hooks/usePortfolio'

export default function HomePage() {
  const { projects, posts } = useApp()
  const { featuredProjects } = usePortfolio()
  return (
    <section data-testid="page-home">
      <h1>Home</h1>
      <p data-testid="project-total">{projects.length}</p>
      <p data-testid="post-total">{posts.length}</p>
      <ul data-testid="featured-list">
        {featuredProjects.map((p) => (
          <li key={p.id} data-testid={`featured-${p.id}`}>
            {p.title}
          </li>
        ))}
      </ul>
    </section>
  )
}
