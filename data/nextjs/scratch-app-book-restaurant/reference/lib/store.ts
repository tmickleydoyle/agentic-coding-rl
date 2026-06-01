import type { Reservation, Table } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let tables: Table[] = []
let reservations: Reservation[] = []
let nextId = 1

function seed(): void {
  tables = [
    { id: 't1', name: 'T1 Window', capacity: 2 },
    { id: 't2', name: 'T2 Booth', capacity: 4 },
    { id: 't3', name: 'T3 Patio', capacity: 6 },
  ]
  reservations = [
    { id: 'r1', tableId: 't1', time: '19:00', party: 2, name: 'Ada' },
    { id: 'r2', tableId: 't2', time: '20:00', party: 3, name: 'Grace' },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listTables(): Table[] {
  return tables.slice()
}

export function findTable(id: string): Table | undefined {
  return tables.find((t) => t.id === id)
}

export function listReservations(filter?: { tableId?: string | null; time?: string | null }): Reservation[] {
  let out = reservations.slice()
  const tableId = filter?.tableId
  if (tableId) out = out.filter((r) => r.tableId === tableId)
  const time = filter?.time
  if (time) out = out.filter((r) => r.time === time)
  return out
}

export function isReserved(tableId: string, time: string): boolean {
  return reservations.some((r) => r.tableId === tableId && r.time === time)
}

export function createReservation(input: {
  tableId: string
  time: string
  party: number
  name: string
}): Reservation {
  const reservation: Reservation = {
    id: `r${nextId++}`,
    tableId: input.tableId,
    time: input.time,
    party: input.party,
    name: input.name,
  }
  reservations.push(reservation)
  return reservation
}

export function deleteReservation(id: string): boolean {
  const idx = reservations.findIndex((r) => r.id === id)
  if (idx === -1) return false
  reservations.splice(idx, 1)
  return true
}
