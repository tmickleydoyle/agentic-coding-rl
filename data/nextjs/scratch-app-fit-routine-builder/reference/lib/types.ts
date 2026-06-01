export type Weekday =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun'

export type LibraryExercise = {
  id: string
  name: string
  muscle: string
}

export type Routine = {
  id: string
  name: string
  exerciseIds: string[]
  day: Weekday | null
}

export type Route = 'routines' | 'builder' | 'week-plan' | 'library'
export type Theme = 'light' | 'dark'
