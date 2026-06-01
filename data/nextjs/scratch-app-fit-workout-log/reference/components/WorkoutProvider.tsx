'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Exercise, LoggedExercise, Route, Theme, Workout } from '../lib/types'

type NewWorkoutInput = {
  name: string
  date: string
  exercises: LoggedExercise[]
}

type WorkoutApi = {
  workouts: Workout[]
  exercises: Exercise[]
  theme: Theme
  route: Route
  selectedWorkoutId: string | null
  addWorkout: (input: NewWorkoutInput) => void
  removeWorkout: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
  openWorkout: (id: string) => void
}

const WorkoutContext = createContext<WorkoutApi | null>(null)

const SEED_EXERCISES: Exercise[] = [
  { id: 'e1', name: 'Bench Press', muscle: 'Chest' },
  { id: 'e2', name: 'Squat', muscle: 'Legs' },
  { id: 'e3', name: 'Deadlift', muscle: 'Back' },
]

const SEED_WORKOUTS: Workout[] = [
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

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>(SEED_WORKOUTS)
  const [exercises] = useState<Exercise[]>(SEED_EXERCISES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('log')
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(3)

  const value = useMemo<WorkoutApi>(() => {
    const addWorkout = (input: NewWorkoutInput) => {
      const id = `w${nextId}`
      setNextId((n) => n + 1)
      setWorkouts((prev) => [
        ...prev,
        {
          id,
          name: input.name,
          date: input.date,
          exercises: input.exercises,
        },
      ])
    }

    const removeWorkout = (id: string) => {
      setWorkouts((prev) => prev.filter((w) => w.id !== id))
      setSelectedWorkoutId((cur) => (cur === id ? null : cur))
    }

    const navigate = (next: Route) => setRoute(next)

    const openWorkout = (id: string) => {
      setSelectedWorkoutId(id)
      setRoute('workout-detail')
    }

    return {
      workouts,
      exercises,
      theme,
      route,
      selectedWorkoutId,
      addWorkout,
      removeWorkout,
      setTheme,
      navigate,
      openWorkout,
    }
  }, [workouts, exercises, theme, route, selectedWorkoutId, nextId])

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
}

export function useWorkout(): WorkoutApi {
  const v = useContext(WorkoutContext)
  if (!v) throw new Error('useWorkout must be used within a WorkoutProvider')
  return v
}
