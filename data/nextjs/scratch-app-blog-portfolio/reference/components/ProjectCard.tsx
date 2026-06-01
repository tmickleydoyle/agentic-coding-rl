'use client'
import type { Project } from '../lib/types'

export default function ProjectCard({
  project,
  onToggleFeatured,
  onOpen,
}: {
  project: Project
  onToggleFeatured: (id: string) => void
  onOpen: (id: string) => void
}) {
  return (
    <li
      data-testid={`project-${project.id}`}
      data-featured={project.featured ? 'true' : 'false'}
    >
      <span data-testid={`project-${project.id}-title`}>{project.title}</span>
      <span data-testid={`project-${project.id}-tags`}>{project.tags.join(', ')}</span>
      <button
        data-testid={`feature-${project.id}`}
        onClick={() => onToggleFeatured(project.id)}
      >
        {project.featured ? 'Unfeature' : 'Feature'}
      </button>
      <button data-testid={`open-${project.id}`} onClick={() => onOpen(project.id)}>
        Open
      </button>
    </li>
  )
}
