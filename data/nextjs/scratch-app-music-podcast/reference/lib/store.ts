import type { Show } from './types'

let shows: Show[] = []
let nextId = 1

function seed(): void {
  shows = [
    {
      id: 'sh1',
      title: 'Tech Talk',
      category: 'tech',
      subscribed: true,
      episodes: [
        { id: 'e1', title: 'Intro', durationMin: 30, played: true },
        { id: 'e2', title: 'Deep Dive', durationMin: 45, played: false },
      ],
    },
    {
      id: 'sh2',
      title: 'Daily News',
      category: 'news',
      subscribed: false,
      episodes: [{ id: 'e3', title: 'Monday', durationMin: 15, played: false }],
    },
    {
      id: 'sh3',
      title: 'Code Cast',
      category: 'tech',
      subscribed: false,
      episodes: [
        { id: 'e4', title: 'Rust', durationMin: 50, played: false },
        { id: 'e5', title: 'Go', durationMin: 40, played: true },
      ],
    },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listShows(filter?: {
  category?: string | null
  subscribed?: string | null
}): Show[] {
  let out = shows.slice()
  const category = filter?.category
  if (category) out = out.filter((s) => s.category === category)
  const subscribed = filter?.subscribed
  if (subscribed === 'true') out = out.filter((s) => s.subscribed)
  return out
}

export function createShow(input: { title: string; category?: string }): Show {
  const show: Show = {
    id: `sh${nextId++}`,
    title: input.title,
    category: input.category ?? '',
    subscribed: false,
    episodes: [],
  }
  shows.push(show)
  return show
}

export function findShow(id: string): Show | undefined {
  return shows.find((s) => s.id === id)
}

export function updateShow(
  id: string,
  patch: { title?: string; category?: string; subscribed?: boolean; subscribe?: boolean },
): Show | undefined {
  const show = shows.find((s) => s.id === id)
  if (!show) return undefined
  if (typeof patch.title === 'string') show.title = patch.title
  if (typeof patch.category === 'string') show.category = patch.category
  if (typeof patch.subscribed === 'boolean') show.subscribed = patch.subscribed
  if (typeof patch.subscribe === 'boolean') show.subscribed = patch.subscribe
  return show
}

export function deleteShow(id: string): boolean {
  const idx = shows.findIndex((s) => s.id === id)
  if (idx === -1) return false
  shows.splice(idx, 1)
  return true
}
