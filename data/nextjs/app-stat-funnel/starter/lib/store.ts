import type { FunnelRow, Segment, Step } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `steps` + an id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listSteps(): Step[] {
  // TODO: return steps sorted by order
  return []
}

export function computeRows(_input: Step[], _segment: Segment): FunnelRow[] {
  // TODO: per ordered step compute { id, name, count, dropOff, conversion } for the segment
  return []
}

export function createStep(_input: {
  name: string
  all: number
  mobile?: number
  desktop?: number
}): Step {
  // TODO: append a step with the next order and counts; return it
  return { id: '', name: '', order: 0, counts: { all: 0, mobile: 0, desktop: 0 } }
}

export function deleteStep(_id: string): boolean {
  // TODO: remove the step; return whether it existed
  return false
}
