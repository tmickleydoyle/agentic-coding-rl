'use client'
import { useApp } from '../../components/AppStateProvider'
import { useTimesheet } from '../../hooks/useTimesheet'

export default function ProjectsPage() {
  const { projects } = useApp()
  const { totalsByProject } = useTimesheet()
  return (
    <section data-testid="page-projects">
      <h1>Projects</h1>
      <ul data-testid="project-list">
        {projects.map((p) => (
          <li key={p.id} data-testid={`project-${p.id}`}>
            <span data-testid={`project-${p.id}-name`}>{p.name}</span>
            <span data-testid={`project-${p.id}-total`}>{totalsByProject[p.id] ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
