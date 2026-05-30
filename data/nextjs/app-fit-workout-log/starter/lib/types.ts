export type ExerciseSet = {
  reps: number
  weight: number
}

export type LoggedExercise = {
  exerciseId: string
  sets: ExerciseSet[]
}

export type Workout = {
  id: string
  date: string
  name: string
  exercises: LoggedExercise[]
}

export type Exercise = {
  id: string
  name: string
  muscle: string
}

export type Route = 'log' | 'workout-detail' | 'exercises' | 'records'
export type Theme = 'light' | 'dark'
