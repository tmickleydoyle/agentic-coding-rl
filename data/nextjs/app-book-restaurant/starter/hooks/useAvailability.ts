'use client'
import { useApp } from '../components/AppStateProvider'
import type { Table } from '../lib/types'

export function useAvailability() {
  // TODO: derive isReserved(tableId, time), freeTables(time, party), and
  // reservationsByTime from the shared tables/reservations state.
  useApp()
  const isReserved = (_tableId: string, _time: string): boolean => false
  const freeTables = (_time: string, _party: number): Table[] => []
  const reservationsByTime: Record<string, number> = {}
  return { isReserved, freeTables, reservationsByTime }
}
