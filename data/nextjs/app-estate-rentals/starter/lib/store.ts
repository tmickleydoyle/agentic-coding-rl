import type { AppStatus, Application, Unit } from './types'
import { APP_STATUSES } from './types'

// In-memory server store shared by both API routes, separate from the client Context state.
// TODO: hold module-level `units`, `applications`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function occupancyRate(): number {
  // TODO: whole-number percent of occupied units (0 when none)
  return 0
}

export function listUnits(_occupied?: boolean | null): Unit[] {
  // TODO: return units, optionally filtered by occupied
  return []
}

export function findUnit(_id: string): Unit | undefined {
  // TODO: look up a unit by id
  return undefined
}

export function updateUnit(_id: string, _patch: { occupied?: boolean }): Unit | undefined {
  // TODO: apply the patch and return the updated unit, or undefined if absent
  return undefined
}

export function listApplications(_filter?: {
  unitId?: string | null
  status?: string | null
}): Application[] {
  // TODO: return applications, applying optional unitId + status filters (AND)
  return []
}

export function findApplication(_id: string): Application | undefined {
  // TODO: look up an application by id
  return undefined
}

export function createApplication(_input: { unitId: string; applicant: string }): Application {
  // TODO: append a pending application with a fresh id and return it
  return { id: '', unitId: '', applicant: '', status: 'pending' }
}

export function setApplicationStatus(_id: string, _status: AppStatus): Application | undefined {
  // TODO: set status; approving marks the unit occupied; return the updated app or undefined
  return undefined
}

export function isStatus(value: unknown): value is AppStatus {
  return typeof value === 'string' && (APP_STATUSES as string[]).includes(value)
}
