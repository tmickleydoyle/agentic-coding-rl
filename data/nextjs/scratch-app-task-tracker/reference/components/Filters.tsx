'use client'
import type { Project, ProjectFilter, StatusFilter } from '../lib/types'

export default function Filters({
  projects,
  statusFilter,
  projectFilter,
  onStatusChange,
  onProjectChange,
}: {
  projects: Project[]
  statusFilter: StatusFilter
  projectFilter: ProjectFilter
  onStatusChange: (filter: StatusFilter) => void
  onProjectChange: (filter: ProjectFilter) => void
}) {
  return (
    <div data-testid="filters">
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="done">Done</option>
      </select>

      <label htmlFor="project-filter">Project</label>
      <select
        id="project-filter"
        data-testid="project-filter"
        value={projectFilter}
        onChange={(e) => onProjectChange(e.target.value)}
      >
        <option value="all">All projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}
