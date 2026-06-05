import type { Booking, Service } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let services: Service[] = []
let bookings: Booking[] = []
let nextBookingId = 1

function seed(): void {
  services = [
    { id: 's1', name: 'Haircut', durationMin: 30 },
    { id: 's2', name: 'Massage', durationMin: 60 },
    { id: 's3', name: 'Consultation', durationMin: 45 },
  ]
  bookings = [
    { id: 'b1', serviceId: 's1', slot: '09:00', customer: 'Ada' },
    { id: 'b2', serviceId: 's2', slot: '10:00', customer: 'Grace' },
  ]
  nextBookingId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listServices(): Service[] {
  return services.slice()
}

export function listBookings(filter?: { serviceId?: string | null; slot?: string | null }): Booking[] {
  let out = bookings.slice()
  const serviceId = filter?.serviceId
  if (serviceId) out = out.filter((b) => b.serviceId === serviceId)
  const slot = filter?.slot
  if (slot) out = out.filter((b) => b.slot === slot)
  return out
}

export function isSlotTaken(serviceId: string, slot: string): boolean {
  return bookings.some((b) => b.serviceId === serviceId && b.slot === slot)
}

export function createBooking(input: { serviceId: string; slot: string; customer: string }): Booking {
  const booking: Booking = {
    id: `b${nextBookingId++}`,
    serviceId: input.serviceId,
    slot: input.slot,
    customer: input.customer,
  }
  bookings.push(booking)
  return booking
}

export function deleteBooking(id: string): boolean {
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx === -1) return false
  bookings.splice(idx, 1)
  return true
}
