import type { PageStat } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let pages: PageStat[] = []
let nextPageId = 1

function seed(): void {
  pages = [
    { id: 'pg1', path: '/', views: 1000, sessions: 800, bounceRate: 40, range7d: 200, range30d: 600 },
    { id: 'pg2', path: '/blog', views: 600, sessions: 500, bounceRate: 55, range7d: 150, range30d: 400 },
    { id: 'pg3', path: '/about', views: 300, sessions: 250, bounceRate: 70, range7d: 50, range30d: 120 },
    { id: 'pg4', path: '/pricing', views: 400, sessions: 380, bounceRate: 35, range7d: 120, range30d: 300 },
  ]
  nextPageId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function viewsForRange(page: PageStat, range: string | null | undefined): number {
  if (range === '7d') return page.range7d
  if (range === '30d') return page.range30d
  return page.views
}

export function listPages(filter?: { range?: string | null; minViews?: number | null }): PageStat[] {
  const range = filter?.range
  let out = pages.map((p) => {
    if (range === '7d') return { ...p, views: p.range7d }
    if (range === '30d') return { ...p, views: p.range30d }
    return { ...p }
  })
  const minViews = filter?.minViews
  if (typeof minViews === 'number') out = out.filter((p) => p.views >= minViews)
  return out
}

export function findPage(id: string): PageStat | undefined {
  return pages.find((p) => p.id === id)
}

export function createPage(input: {
  path: string
  views?: number
  sessions?: number
  bounceRate?: number
}): PageStat {
  const page: PageStat = {
    id: `pg${nextPageId++}`,
    path: input.path,
    views: input.views ?? 0,
    sessions: input.sessions ?? 0,
    bounceRate: input.bounceRate ?? 0,
    range7d: 0,
    range30d: 0,
  }
  pages.push(page)
  return page
}

export function updatePage(
  id: string,
  patch: { views?: number; sessions?: number; bounceRate?: number },
): PageStat | undefined {
  const page = pages.find((p) => p.id === id)
  if (!page) return undefined
  if (typeof patch.views === 'number') page.views = patch.views
  if (typeof patch.sessions === 'number') page.sessions = patch.sessions
  if (typeof patch.bounceRate === 'number') page.bounceRate = patch.bounceRate
  return page
}

export function deletePage(id: string): boolean {
  const idx = pages.findIndex((p) => p.id === id)
  if (idx === -1) return false
  pages.splice(idx, 1)
  return true
}
