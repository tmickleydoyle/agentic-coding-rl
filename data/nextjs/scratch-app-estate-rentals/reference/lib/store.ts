import type { AppStatus, Application, Unit } from './types'
import { APP_STATUSES } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let units: Unit[] = []
let applications: Application[] = []
let nextAppId = 1

function seed(): void {
  units = [
    { id: 'u1', label: 'A1', rent: 1200, occupied: true },
    { id: 'u2', label: 'A2', rent: 1500, occupied: false },
    { id: 'u3', label: 'B1', rent: 1800, occupied: false },
  ]
  applications = [
    { id: 'a1', unitId: 'u2', applicant: 'Ada', status: 'pending' },
    { id: 'a2', unitId: 'u2', applicant: 'Lee', status: 'rejected' },
    { id: 'a3', unitId: 'u3', applicant: 'Sam', status: 'pending' },
  ]
  nextAppId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function occupancyRate(): number {
  if (units.length === 0) return 0
  const occupied = units.filter((u) => u.occupied).length
  return Math.round((occupied / units.length) * 100)
}

export function listUnits(occupied?: boolean | null): Unit[] {
  let out = units.slice()
  if (occupied === true) out = out.filter((u) => u.occupied)
  else if (occupied === false) out = out.filter((u) => !u.occupied)
  return out
}

export function findUnit(id: string): Unit | undefined {
  return units.find((u) => u.id === id)
}

export function updateUnit(id: string, patch: { occupied?: boolean }): Unit | undefined {
  const unit = units.find((u) => u.id === id)
  if (!unit) return undefined
  if (typeof patch.occupied === 'boolean') unit.occupied = patch.occupied
  return unit
}

export function listApplications(filter?: {
  unitId?: string | null
  status?: string | null
}): Application[] {
  let out = applications.slice()
  const unitId = filter?.unitId
  if (unitId) out = out.filter((a) => a.unitId === unitId)
  const status = filter?.status
  if (status) out = out.filter((a) => a.status === status)
  return out
}

export function findApplication(id: string): Application | undefined {
  return applications.find((a) => a.id === id)
}

export function createApplication(input: {
  unitId: string
  applicant: string
}): Application {
  const app: Application = {
    id: `a${nextAppId++}`,
    unitId: input.unitId,
    applicant: input.applicant,
    status: 'pending',
  }
  applications.push(app)
  return app
}

export function setApplicationStatus(
  id: string,
  status: AppStatus,
): Application | undefined {
  const app = applications.find((a) => a.id === id)
  if (!app) return undefined
  app.status = status
  if (status === 'approved') {
    const unit = units.find((u) => u.id === app.unitId)
    if (unit) unit.occupied = true
  }
  return app
}

export function isStatus(value: unknown): value is AppStatus {
  return typeof value === 'string' && (APP_STATUSES as string[]).includes(value)
}
