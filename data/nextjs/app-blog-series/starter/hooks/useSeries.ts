'use client'
import { useApp } from '../components/AppStateProvider'
import type { Part } from '../lib/types'

export type SeriesProgress = {
  total: number
  read: number
  percent: number
}

export function sortParts(_parts: Part[], _seriesId: string): Part[] {
  // TODO: filter to the series and sort by order
  return []
}

export function seriesProgress(_parts: Part[], _seriesId: string): SeriesProgress {
  // TODO: compute total/read/percent for a series
  return { total: 0, read: 0, percent: 0 }
}

export function useSeries() {
  const { parts } = useApp()
  const partsFor = (seriesId: string): Part[] => sortParts(parts, seriesId)
  const progressFor = (seriesId: string): SeriesProgress => seriesProgress(parts, seriesId)
  return { partsFor, progressFor }
}
