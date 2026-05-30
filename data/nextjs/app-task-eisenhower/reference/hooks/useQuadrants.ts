'use client'
import { useMatrix } from '../components/MatrixProvider'
import type { Quadrant, Task } from '../lib/types'
import { QUADRANTS, quadrantOf } from '../lib/types'

export function groupByQuadrant(tasks: Task[]): Record<Quadrant, Task[]> {
  const out: Record<Quadrant, Task[]> = {
    do: [],
    schedule: [],
    delegate: [],
    delete: [],
  }
  tasks.forEach((t) => {
    out[quadrantOf(t)].push(t)
  })
  return out
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
