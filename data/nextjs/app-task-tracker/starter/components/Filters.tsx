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
  // TODO: render status-filter and project-filter <select>s wired to the callbacks.
  void projects
  void statusFilter
  void projectFilter
  void onStatusChange
  void onProjectChange
  return <div data-testid="filters" />
}
