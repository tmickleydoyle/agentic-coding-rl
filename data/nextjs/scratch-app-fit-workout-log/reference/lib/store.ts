import type { Exercise, Workout } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// WorkoutProvider state. Tests call __reset() in beforeEach.

let workouts: Workout[] = []
let exercises: Exercise[] = []
let nextWorkoutId = 1

function seed(): void {
  exercises = [
    { id: 'e1', name: 'Bench Press', muscle: 'Chest' },
    { id: 'e2', name: 'Squat', muscle: 'Legs' },
    { id: 'e3', name: 'Deadlift', muscle: 'Back' },
  ]
  workouts = [
    {
      id: 'w1',
      date: '2026-05-01',
      name: 'Push Day',
      exercises: [
        { exerciseId: 'e1', sets: [{ reps: 8, weight: 100 }, { reps: 8, weight: 100 }] },
      ],
    },
    {
      id: 'w2',
      date: '2026-05-03',
      name: 'Leg Day',
      exercises: [
        { exerciseId: 'e2', sets: [{ reps: 5, weight: 140 }, { reps: 5, weight: 150 }] },
      ],
    },
  ]
  nextWorkoutId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listWorkouts(): Workout[] {
  return workouts.slice()
}

export function findWorkout(id: string): Workout | undefined {
  return workouts.find((w) => w.id === id)
}

export function createWorkout(input: {
  name: string
  date?: string
  exercises?: Workout['exercises']
}): Workout {
  const workout: Workout = {
    id: `w${nextWorkoutId++}`,
    name: input.name,
    date: input.date ?? '2026-01-01',
    exercises: input.exercises ?? [],
  }
  workouts.push(workout)
  return workout
}

export function deleteWorkout(id: string): boolean {
  const idx = workouts.findIndex((w) => w.id === id)
  if (idx === -1) return false
  workouts.splice(idx, 1)
  return true
}

export function listExercises(): Exercise[] {
  return exercises.slice()
}

// The personal record (max weight) for an exercise across all workouts.
export function recordFor(exerciseId: string): number {
  let max = 0
  workouts.forEach((w) => {
    w.exercises.forEach((le) => {
      if (le.exerciseId !== exerciseId) return
      le.sets.forEach((s) => {
        if (s.weight > max) max = s.weight
      })
    })
  })
  return max
}
