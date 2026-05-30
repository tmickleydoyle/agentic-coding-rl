export type Step = {
  id: string
  label: string
  done: boolean
}

export type RoutineKind = 'morning' | 'evening'

export type Routine = {
  id: string
  name: string
  kind: RoutineKind
  steps: Step[]
  history: string[]
}

export type Route = 'today' | 'routines' | 'builder' | 'stats'
export type Theme = 'light' | 'dark'

export const TODAY = '2026-05-28'
