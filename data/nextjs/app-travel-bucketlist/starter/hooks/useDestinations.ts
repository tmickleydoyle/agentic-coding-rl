'use client'
import { useApp } from '../components/AppStateProvider'
import type { Destination } from '../lib/types'

export function filterByContinent(_destinations: Destination[], _continentFilter: string): Destination[] {
  return [] // TODO: 'all' => all; else filter by continent
}

export function groupByContinent(_destinations: Destination[]): { continent: string; items: Destination[] }[] {
  return [] // TODO: group by continent, continents sorted
}

export function continents(_destinations: Destination[]): string[] {
  return [] // TODO: sorted unique continents
}

export function visitedCount(_destinations: Destination[]): number {
  return 0 // TODO: count visited
}

export function useDestinations() {
  useApp() // TODO: derive { filtered, groups, allContinents, visited, remaining } from context
  return {
    filtered: [] as Destination[],
    groups: [] as { continent: string; items: Destination[] }[],
    allContinents: [] as string[],
    visited: 0,
    remaining: 0,
  }
}
