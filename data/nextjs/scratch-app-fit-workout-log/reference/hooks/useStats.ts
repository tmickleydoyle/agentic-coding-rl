'use client'
import { useWorkout } from '../components/WorkoutProvider'
import type { Exercise, Workout } from '../lib/types'

export type WorkoutStats = {
  totalWorkouts: number
  totalSets: number
  totalVolume: number
}

// Personal record (best single-set weight) per exercise id.
export function personalRecords(workouts: Workout[]): Record<string, number> {
  const out: Record<string, number> = {}
  workouts.forEach((w) => {
    w.exercises.forEach((le) => {
      le.sets.forEach((s) => {
        const cur = out[le.exerciseId] ?? 0
        if (s.weight > cur) out[le.exerciseId] = s.weight
      })
    })
  })
  return out
}

export function computeStats(workouts: Workout[]): WorkoutStats {
  let totalSets = 0
  let totalVolume = 0
  workouts.forEach((w) => {
    w.exercises.forEach((le) => {
      le.sets.forEach((s) => {
        totalSets += 1
        totalVolume += s.reps * s.weight
      })
    })
  })
  return {
    totalWorkouts: workouts.length,
    totalSets,
    totalVolume,
  }
}

export function useStats() {
  const { workouts, exercises } = useWorkout()
  const records = personalRecords(workouts)
  const stats = computeStats(workouts)
  const exerciseById = (id: string): Exercise | undefined =>
    exercises.find((e) => e.id === id)
  return { records, stats, exerciseById }
}
