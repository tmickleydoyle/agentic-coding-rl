import type { Objective } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level objectives and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listObjectives(): Objective[] {
  // TODO: return all objectives (deep-copied)
  return []
}

export function objectivesWithProgress(): {
  objectives: Array<Objective & { progress: number }>
  company: number
} {
  // TODO: return objectives each with a rolled-up progress, plus the company rollup
  return { objectives: [], company: 0 }
}

export function findObjective(_id: string): Objective | undefined {
  // TODO: look up an objective by id
  return undefined
}

export function createObjective(_input: { title: string; owner?: string }): Objective {
  // TODO: append a new objective (empty keyResults) with a fresh id and return it
  return { id: '', title: '', owner: '', keyResults: [] }
}

export function setKeyResultProgress(
  _objectiveId: string,
  _krId: string,
  _progress: number,
): Objective | undefined {
  // TODO: clamp + set the key result progress; return the objective or undefined if absent
  return undefined
}
