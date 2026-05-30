'use client'
import { useApp } from '../components/AppStateProvider'
import type { Clip } from '../lib/types'

export function findClip(_clips: Clip[], _id: string | null): Clip | undefined {
  // TODO: look up a clip by id
  return undefined
}

export function categoryCounts(_clips: Clip[]): { category: string; count: number }[] {
  // TODO: group clips by category (first-seen order) with counts
  return []
}

export function filterByCategory(_clips: Clip[], _category: string | null): Clip[] {
  // TODO: all clips when category is null, else matching clips
  return []
}

export function useSaved(): Clip[] {
  // TODO: return saved clips in savedIds order
  void useApp
  return []
}
