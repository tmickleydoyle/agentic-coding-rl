'use client'
import type { Project } from '../lib/types'

export default function ProjectRow({
  project,
  count,
  onOpen,
}: {
  project: Project
  count: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`project-${project.id}`}>
      <span data-testid={`project-${project.id}-name`}>{project.name}</span>
      <span data-testid={`project-${project.id}-count`}>{count}</span>
      <button data-testid={`open-${project.id}`} onClick={() => onOpen(project.id)}>
        Open
      </button>
    </li>
  )
}
