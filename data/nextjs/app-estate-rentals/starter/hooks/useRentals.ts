'use client'
import { useApp } from '../components/AppStateProvider'
import type { Application, Unit } from '../lib/types'

export function computeOccupancy(_units: Unit[]): number {
  // TODO: whole-number percent of occupied units (0 when none)
  return 0
}

export function countPending(_applications: Application[]): number {
  // TODO: number of pending applications
  return 0
}

export function useRentals() {
  const { units, applications } = useApp()
  const occupancyRate = computeOccupancy(units)
  const occupiedCount = units.filter((u) => u.occupied).length
  const vacantCount = units.length - occupiedCount
  const applicationsFor = (unitId: string): Application[] =>
    applications.filter((a) => a.unitId === unitId)
  const pendingCount = countPending(applications)
  return { occupancyRate, occupiedCount, vacantCount, applicationsFor, pendingCount }
}
