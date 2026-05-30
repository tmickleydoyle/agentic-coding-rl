'use client'
import { useApp } from '../components/AppStateProvider'
import type { Part } from '../lib/types'

export type SeriesProgress = {
  total: number
  read: number
  percent: number
}

export function sortParts(parts: Part[], seriesId: string): Part[] {
  return parts
    .filter((p) => p.seriesId === seriesId)
    .slice()
    .sort((a, b) => a.order - b.order)
}

export function seriesProgress(parts: Part[], seriesId: string): SeriesProgress {
  const inSeries = parts.filter((p) => p.seriesId === seriesId)
  const total = inSeries.length
  const read = inSeries.filter((p) => p.read).length
  const percent = total === 0 ? 0 : Math.round((read / total) * 100)
  return { total, read, percent }
}

export function useSeries() {
  const { parts } = useApp()
  const partsFor = (seriesId: string): Part[] => sortParts(parts, seriesId)
  const progressFor = (seriesId: string): SeriesProgress => seriesProgress(parts, seriesId)
  return { partsFor, progressFor }
}
