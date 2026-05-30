'use client'
import type { Objective } from '../lib/types'

export default function ObjectiveRow({
  objective,
  progress,
  onOpen,
}: {
  objective: Objective
  progress: number
  onOpen: (id: string) => void
}) {
  // TODO: render <li data-testid="objective-<id>"> with title, owner, progress, and an
  // open-<id> button.
  void progress
  void onOpen
  return <li data-testid={`objective-${objective.id}`} />
}
