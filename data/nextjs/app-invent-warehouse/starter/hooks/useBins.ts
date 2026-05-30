'use client'
import { useWarehouse } from '../components/AppStateProvider'
import type { Bin } from '../lib/types'

export type WarehouseStats = {
  bins: number
  capacity: number
  used: number
}

export function useBins() {
  // TODO: derive `stats` ({ bins, capacity, used } summed across bins) and `selected`
  // (the bin with selectedId, or null).
  const { bins } = useWarehouse()
  return {
    bins,
    stats: { bins: 0, capacity: 0, used: 0 } as WarehouseStats,
    selected: null as Bin | null,
  }
}
