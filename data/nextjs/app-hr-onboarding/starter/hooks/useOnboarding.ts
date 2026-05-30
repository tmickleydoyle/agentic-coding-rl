'use client'
import { useApp } from '../components/AppStateProvider'
import type { OnboardTask } from '../lib/types'

export function tasksForHire(_tasks: OnboardTask[], _hireId: string): OnboardTask[] {
  // TODO: filter tasks by hireId
  return []
}

export function percentComplete(_tasks: OnboardTask[], _hireId: string): number {
  // TODO: percent of the hire's tasks that are done (0 when none)
  return 0
}

export function doneCount(_tasks: OnboardTask[], _hireId: string): number {
  // TODO: count of the hire's done tasks
  return 0
}

export function useOnboarding() {
  const { hires, tasks } = useApp()
  const progress = hires.map((h) => ({
    hire: h,
    total: tasksForHire(tasks, h.id).length,
    done: doneCount(tasks, h.id),
    percent: percentComplete(tasks, h.id),
  }))
  return { progress }
}
