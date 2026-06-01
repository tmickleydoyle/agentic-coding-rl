import type { Feedback, House } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let houses: House[] = []

function seed(): void {
  houses = [
    {
      id: 'h1',
      address: '12 Oak St',
      time: '10:00',
      visitors: [{ name: 'Ada' }, { name: 'Lee' }],
      feedback: [{ visitor: 'Ada', rating: 5, note: 'Bright' }],
    },
    {
      id: 'h2',
      address: '9 Pine Ave',
      time: '11:30',
      visitors: [{ name: 'Sam' }],
      feedback: [],
    },
    {
      id: 'h3',
      address: '4 Elm Rd',
      time: '13:00',
      visitors: [],
      feedback: [],
    },
  ]
}

seed()

export function __reset(): void {
  seed()
}

export type HouseWithCounts = House & { visitorCount: number; feedbackCount: number }

function withCounts(h: House): HouseWithCounts {
  return { ...h, visitorCount: h.visitors.length, feedbackCount: h.feedback.length }
}

export function listHouses(houseId?: string | null): HouseWithCounts[] {
  if (houseId) {
    const h = houses.find((x) => x.id === houseId)
    return h ? [withCounts(h)] : []
  }
  return houses.map(withCounts)
}

export function findHouse(id: string): House | undefined {
  return houses.find((h) => h.id === id)
}

export function registerVisitor(id: string, name: string): HouseWithCounts | undefined {
  const house = houses.find((h) => h.id === id)
  if (!house) return undefined
  house.visitors.push({ name })
  return withCounts(house)
}

export function addFeedback(
  id: string,
  feedback: Feedback,
): HouseWithCounts | undefined {
  const house = houses.find((h) => h.id === id)
  if (!house) return undefined
  house.feedback.push(feedback)
  return withCounts(house)
}
