'use client'
import { useApp } from '../components/AppStateProvider'
import type { Application, Unit } from '../lib/types'

export function computeOccupancy(units: Unit[]): number {
  if (units.length === 0) return 0
  const occupied = units.filter((u) => u.occupied).length
  return Math.round((occupied / units.length) * 100)
}

export function countPending(applications: Application[]): number {
  return applications.filter((a) => a.status === 'pending').length
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
