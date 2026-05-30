'use client'
import { useApp } from '../components/AppStateProvider'
import type { Reservation, Table } from '../lib/types'

export function tableIsReserved(reservations: Reservation[], tableId: string, time: string): boolean {
  return reservations.some((r) => r.tableId === tableId && r.time === time)
}

export function findFreeTables(
  tables: Table[],
  reservations: Reservation[],
  time: string,
  party: number,
): Table[] {
  return tables.filter(
    (t) => t.capacity >= party && !tableIsReserved(reservations, t.id, time),
  )
}

export function useAvailability() {
  const { tables, reservations } = useApp()

  const isReserved = (tableId: string, time: string): boolean =>
    tableIsReserved(reservations, tableId, time)

  const freeTables = (time: string, party: number): Table[] =>
    findFreeTables(tables, reservations, time, party)

  const reservationsByTime: Record<string, number> = {}
  reservations.forEach((r) => {
    reservationsByTime[r.time] = (reservationsByTime[r.time] ?? 0) + 1
  })

  return { isReserved, freeTables, reservationsByTime }
}
