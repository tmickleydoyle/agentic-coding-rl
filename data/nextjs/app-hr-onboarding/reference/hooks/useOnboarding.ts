'use client'
import { useApp } from '../components/AppStateProvider'
import type { OnboardTask } from '../lib/types'

export function tasksForHire(tasks: OnboardTask[], hireId: string): OnboardTask[] {
  return tasks.filter((t) => t.hireId === hireId)
}

export function percentComplete(tasks: OnboardTask[], hireId: string): number {
  const own = tasks.filter((t) => t.hireId === hireId)
  if (own.length === 0) return 0
  const done = own.filter((t) => t.done).length
  return Math.round((done / own.length) * 100)
}

export function doneCount(tasks: OnboardTask[], hireId: string): number {
  return tasks.filter((t) => t.hireId === hireId && t.done).length
}

export function useOnboarding() {
  const { hires, tasks } = useApp()
  const progress = hires.map((h) => {
    const own = tasks.filter((t) => t.hireId === h.id)
    const done = own.filter((t) => t.done).length
    return {
      hire: h,
      total: own.length,
      done,
      percent: own.length === 0 ? 0 : Math.round((done / own.length) * 100),
    }
  })
  return { progress }
}
