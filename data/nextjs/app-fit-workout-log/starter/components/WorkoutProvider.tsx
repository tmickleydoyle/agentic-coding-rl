'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: WorkoutApi = {
  workouts: [],
  exercises: [],
  theme: 'light',
  route: 'log',
  selectedWorkoutId: null,
  addWorkout: () => {},
  removeWorkout: () => {},
  setTheme: () => {},
  navigate: () => {},
  openWorkout: () => {},
}

export function WorkoutProvider({ children }: { children: ReactNode }) {
  // TODO: hold workouts/exercises/theme/route/selection in state (seed 3 exercises + 2
  // workouts), implement the actions, and provide them through WorkoutContext. The STUB
  // below makes the app mount but does nothing — replace it with real state + actions.
  return <WorkoutContext.Provider value={STUB}>{children}</WorkoutContext.Provider>
}

export function useWorkout(): WorkoutApi {
  const v = useContext(WorkoutContext)
  if (!v) throw new Error('useWorkout must be used within a WorkoutProvider')
  return v
}
