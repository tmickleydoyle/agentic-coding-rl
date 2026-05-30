import type { Routine, RoutineKind } from './types'
import { TODAY } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let routines: Routine[] = []
let nextId = 1

function seed(): void {
  routines = [
    {
      id: 'r1',
      name: 'Morning',
      kind: 'morning',
      history: ['2026-05-26', '2026-05-27'],
      steps: [
        { id: 'r1-s1', label: 'Stretch', done: true },
        { id: 'r1-s2', label: 'Water', done: true },
        { id: 'r1-s3', label: 'Plan day', done: false },
      ],
    },
    {
      id: 'r2',
      name: 'Evening',
      kind: 'evening',
      history: ['2026-05-27'],
      steps: [
        { id: 'r2-s1', label: 'Journal', done: true },
        { id: 'r2-s2', label: 'Read', done: true },
      ],
    },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

function clone(r: Routine): Routine {
  return {
    ...r,
    steps: r.steps.map((s) => ({ ...s })),
    history: r.history.slice(),
  }
}

export function listRoutines(): Routine[] {
  return routines.map(clone)
}

export function addRoutine(input: { name: string; kind: RoutineKind }): Routine {
  const routine: Routine = {
    id: `r${nextId++}`,
    name: input.name,
    kind: input.kind,
    steps: [],
    history: [],
  }
  routines.push(routine)
  return clone(routine)
}

function applyCompletion(r: Routine): void {
  const complete = r.steps.length > 0 && r.steps.every((s) => s.done)
  if (complete) {
    if (!r.history.includes(TODAY)) r.history = [...r.history, TODAY].sort()
  } else {
    r.history = r.history.filter((d) => d !== TODAY)
  }
}

export type StepToggleResult =
  | { kind: 'ok'; routine: Routine }
  | { kind: 'no-routine' }
  | { kind: 'no-step' }

export function toggleStep(routineId: string, stepId: string): StepToggleResult {
  const routine = routines.find((r) => r.id === routineId)
  if (!routine) return { kind: 'no-routine' }
  const step = routine.steps.find((s) => s.id === stepId)
  if (!step) return { kind: 'no-step' }
  step.done = !step.done
  applyCompletion(routine)
  return { kind: 'ok', routine: clone(routine) }
}

export function deleteRoutine(id: string): boolean {
  const idx = routines.findIndex((r) => r.id === id)
  if (idx === -1) return false
  routines.splice(idx, 1)
  return true
}
