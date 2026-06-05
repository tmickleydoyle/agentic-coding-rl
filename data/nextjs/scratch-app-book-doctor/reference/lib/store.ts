import type { Appointment, Provider } from './types'
import { TODAY } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let providers: Provider[] = []
let appointments: Appointment[] = []
let nextId = 1

function seed(): void {
  providers = [
    { id: 'p1', name: 'Dr. Ada Lovelace', specialty: 'Cardiology', slots: ['2026-06-10', '2026-06-12'] },
    { id: 'p2', name: 'Dr. Grace Hopper', specialty: 'Dermatology', slots: ['2026-05-20', '2026-06-15'] },
    { id: 'p3', name: 'Dr. Alan Turing', specialty: 'Neurology', slots: ['2026-06-20'] },
  ]
  appointments = [
    { id: 'a1', providerId: 'p1', date: '2026-06-10', patient: 'Sam' },
    { id: 'a2', providerId: 'p2', date: '2026-05-20', patient: 'Pat' },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listProviders(): Provider[] {
  return providers.slice()
}

export function findProvider(id: string): Provider | undefined {
  return providers.find((p) => p.id === id)
}

export function listAppointments(filter?: {
  providerId?: string | null
  when?: string | null
}): Appointment[] {
  let out = appointments.slice()
  const providerId = filter?.providerId
  if (providerId) out = out.filter((a) => a.providerId === providerId)
  const when = filter?.when
  if (when === 'upcoming') out = out.filter((a) => a.date >= TODAY)
  else if (when === 'past') out = out.filter((a) => a.date < TODAY)
  return out
}

export function isSlotTaken(providerId: string, date: string): boolean {
  return appointments.some((a) => a.providerId === providerId && a.date === date)
}

export function createAppointment(input: {
  providerId: string
  date: string
  patient: string
}): Appointment {
  const appointment: Appointment = {
    id: `a${nextId++}`,
    providerId: input.providerId,
    date: input.date,
    patient: input.patient,
  }
  appointments.push(appointment)
  return appointment
}

export function deleteAppointment(id: string): boolean {
  const idx = appointments.findIndex((a) => a.id === id)
  if (idx === -1) return false
  appointments.splice(idx, 1)
  return true
}
