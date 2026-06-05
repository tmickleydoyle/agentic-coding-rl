import type { Destination } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.
// Tests call __reset() in beforeEach for isolation.

let destinations: Destination[] = []
let nextId = 1

function seed(): void {
  destinations = [
    { id: 'd1', name: 'Kyoto', country: 'Japan', continent: 'Asia', visited: true, notes: 'Temples' },
    { id: 'd2', name: 'Patagonia', country: 'Argentina', continent: 'South America', visited: false, notes: 'Hiking' },
    { id: 'd3', name: 'Reykjavik', country: 'Iceland', continent: 'Europe', visited: false, notes: 'Northern lights' },
    { id: 'd4', name: 'Cairo', country: 'Egypt', continent: 'Africa', visited: true, notes: 'Pyramids' },
    { id: 'd5', name: 'Lisbon', country: 'Portugal', continent: 'Europe', visited: false, notes: 'Trams' },
  ]
  nextId = 6
}

seed()

export function __reset(): void {
  seed()
}

export function listDestinations(filter?: { continent?: string | null; visited?: string | null }): Destination[] {
  let out = destinations.slice()
  const continent = filter?.continent
  if (continent) out = out.filter((d) => d.continent === continent)
  const visited = filter?.visited
  if (visited === 'true') out = out.filter((d) => d.visited)
  else if (visited === 'false') out = out.filter((d) => !d.visited)
  return out
}

export function findDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id)
}

export function createDestination(input: {
  name: string
  country: string
  continent: string
  notes?: string
}): Destination {
  const destination: Destination = {
    id: `d${nextId++}`,
    name: input.name,
    country: input.country,
    continent: input.continent,
    visited: false,
    notes: input.notes ?? '',
  }
  destinations.push(destination)
  return destination
}

export function updateVisited(id: string, visited?: boolean): Destination | undefined {
  const destination = destinations.find((d) => d.id === id)
  if (!destination) return undefined
  destination.visited = typeof visited === 'boolean' ? visited : !destination.visited
  return destination
}
