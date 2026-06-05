import type { Clip } from './types'
import { seedClips } from './seed'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let clips: Clip[] = []

function seed(): void {
  clips = seedClips()
}

seed()

export function __reset(): void {
  seed()
}

export function listClips(): Clip[] {
  return clips.slice()
}

export function findClip(id: string): Clip | undefined {
  return clips.find((c) => c.id === id)
}

export function clipsByCategory(category: string): Clip[] {
  return clips.filter((c) => c.category === category)
}

export function likeClip(id: string): Clip | undefined {
  const c = clips.find((x) => x.id === id)
  if (!c) return undefined
  c.likes += 1
  return c
}
