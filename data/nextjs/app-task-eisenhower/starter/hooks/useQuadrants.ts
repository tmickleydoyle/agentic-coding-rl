'use client'
import { useMatrix } from '../components/MatrixProvider'
import type { Quadrant, Task } from '../lib/types'
import { QUADRANTS } from '../lib/types'

export function groupByQuadrant(_tasks: Task[]): Record<Quadrant, Task[]> {
  // TODO: group tasks by quadrantOf(task), preserving list order
  return { do: [], schedule: [], delegate: [], delete: [] }
}

export function useQuadrants() {
  const { tasks } = useMatrix()
  const byQuadrant = groupByQuadrant(tasks)
  const counts: Record<Quadrant, number> = {
    do: byQuadrant.do.length,
    schedule: byQuadrant.schedule.length,
    delegate: byQuadrant.delegate.length,
    delete: byQuadrant.delete.length,
  }
  return { byQuadrant, counts, quadrants: QUADRANTS }
}
