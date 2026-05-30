'use client'
import { useApp } from '../components/AppStateProvider'
import type { Destination } from '../lib/types'

export function filterByContinent(destinations: Destination[], continentFilter: string): Destination[] {
  if (continentFilter === 'all') return destinations.slice()
  return destinations.filter((d) => d.continent === continentFilter)
}

export function groupByContinent(destinations: Destination[]): { continent: string; items: Destination[] }[] {
  const map: Record<string, Destination[]> = {}
  destinations.forEach((d) => {
    if (!map[d.continent]) map[d.continent] = []
    map[d.continent].push(d)
  })
  const names = Object.keys(map).sort()
  return names.map((continent) => ({ continent, items: map[continent] }))
}

export function continents(destinations: Destination[]): string[] {
  const set: Record<string, true> = {}
  destinations.forEach((d) => {
    set[d.continent] = true
  })
  return Object.keys(set).sort()
}

export function visitedCount(destinations: Destination[]): number {
  let n = 0
  destinations.forEach((d) => {
    if (d.visited) n += 1
  })
  return n
}

export function useDestinations() {
  const { destinations, continentFilter } = useApp()
  const filtered = filterByContinent(destinations, continentFilter)
  const groups = groupByContinent(filtered)
  const allContinents = continents(destinations)
  const visited = visitedCount(destinations)
  const remaining = destinations.length - visited
  return { filtered, groups, allContinents, visited, remaining }
}
