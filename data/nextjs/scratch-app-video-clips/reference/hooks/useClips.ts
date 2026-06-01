'use client'
import { useApp } from '../components/AppStateProvider'
import type { Clip } from '../lib/types'

export function findClip(clips: Clip[], id: string | null): Clip | undefined {
  if (!id) return undefined
  return clips.find((c) => c.id === id)
}

export function categoryCounts(clips: Clip[]): { category: string; count: number }[] {
  const order: string[] = []
  const counts: Record<string, number> = {}
  clips.forEach((c) => {
    if (counts[c.category] === undefined) {
      counts[c.category] = 0
      order.push(c.category)
    }
    counts[c.category] += 1
  })
  return order.map((category) => ({ category, count: counts[category] }))
}

export function filterByCategory(clips: Clip[], category: string | null): Clip[] {
  if (category === null) return clips.slice()
  return clips.filter((c) => c.category === category)
}

export function useSaved(): Clip[] {
  const { clips, savedIds } = useApp()
  const out: Clip[] = []
  savedIds.forEach((id) => {
    const clip = clips.find((c) => c.id === id)
    if (clip) out.push(clip)
  })
  return out
}
