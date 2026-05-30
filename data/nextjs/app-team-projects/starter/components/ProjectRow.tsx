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
  // TODO: render <li data-testid="project-<id>"> with name, count, and an open-<id> button.
  void count
  void onOpen
  return <li data-testid={`project-${project.id}`} />
}
