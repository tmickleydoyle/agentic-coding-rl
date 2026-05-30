'use client'
import type { Quadrant, Task } from '../lib/types'

export default function QuadrantBox({
  quadrant,
  tasks,
  onMove,
  onDelete,
}: {
  quadrant: Quadrant
  tasks: Task[]
  onMove: (id: string, quadrant: Quadrant) => void
  onDelete: (id: string) => void
}) {
  // TODO: render <section data-testid="quadrant-<q>"> with count-<q> and a list of TaskCards.
  void tasks
  void onMove
  void onDelete
  return <section data-testid={`quadrant-${quadrant}`} />
}
