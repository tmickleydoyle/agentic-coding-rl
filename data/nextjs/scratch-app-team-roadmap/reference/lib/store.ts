import type { Initiative, Quarter, Status } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let quarters: Quarter[] = []
let initiatives: Initiative[] = []
let nextId = 1

function seed(): void {
  quarters = [
    { id: 'q1', label: 'Q1' },
    { id: 'q2', label: 'Q2' },
    { id: 'q3', label: 'Q3' },
    { id: 'q4', label: 'Q4' },
  ]
  initiatives = [
    { id: 'i1', title: 'Launch beta', quarterId: 'q1', status: 'in-progress' },
    { id: 'i2', title: 'Mobile app', quarterId: 'q1', status: 'planned' },
    { id: 'i3', title: 'SSO support', quarterId: 'q2', status: 'done' },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listQuarters(): Quarter[] {
  return quarters.slice()
}

export function listInitiatives(filter?: {
  quarterId?: string | null
  status?: string | null
}): Initiative[] {
  let out = initiatives.slice()
  if (filter?.quarterId) out = out.filter((i) => i.quarterId === filter.quarterId)
  if (filter?.status) out = out.filter((i) => i.status === filter.status)
  return out
}

export function createInitiative(input: { title: string; quarterId?: string }): Initiative {
  const initiative: Initiative = {
    id: `i${nextId++}`,
    title: input.title,
    quarterId: input.quarterId ?? 'q1',
    status: 'planned',
  }
  initiatives.push(initiative)
  return initiative
}

export function findInitiative(id: string): Initiative | undefined {
  return initiatives.find((i) => i.id === id)
}

export function updateInitiative(
  id: string,
  patch: { quarterId?: string; status?: Status; title?: string },
): Initiative | undefined {
  const initiative = initiatives.find((i) => i.id === id)
  if (!initiative) return undefined
  if (typeof patch.quarterId === 'string') initiative.quarterId = patch.quarterId
  if (patch.status !== undefined) initiative.status = patch.status
  if (typeof patch.title === 'string') initiative.title = patch.title
  return initiative
}

export function deleteInitiative(id: string): boolean {
  const idx = initiatives.findIndex((i) => i.id === id)
  if (idx === -1) return false
  initiatives.splice(idx, 1)
  return true
}
