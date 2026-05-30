'use client'
import { useWorkout } from '../components/WorkoutProvider'
import type { Exercise, Workout } from '../lib/types'

export type WorkoutStats = {
  totalWorkouts: number
  totalSets: number
  totalVolume: number
}

export function personalRecords(_workouts: Workout[]): Record<string, number> {
  // TODO: best single-set weight per exercise id.
  return {}
}

export function computeStats(_workouts: Workout[]): WorkoutStats {
  // TODO: totals across all workouts/sets.
  return { totalWorkouts: 0, totalSets: 0, totalVolume: 0 }
}

export function useStats() {
  const { workouts, exercises } = useWorkout()
  const records = personalRecords(workouts)
  const stats = computeStats(workouts)
  const exerciseById = (id: string): Exercise | undefined =>
    exercises.find((e) => e.id === id)
  return { records, stats, exerciseById }
}
