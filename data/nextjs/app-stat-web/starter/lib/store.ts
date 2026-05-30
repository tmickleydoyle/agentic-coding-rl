import type { PageStat } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `pages` + an id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function viewsForRange(_page: PageStat, _range: string | null | undefined): number {
  // TODO: range7d for '7d', range30d for '30d', else all-time views
  return 0
}

export function listPages(_filter?: { range?: string | null; minViews?: number | null }): PageStat[] {
  // TODO: return pages, applying optional range (swap views) + minViews filters
  return []
}

export function findPage(_id: string): PageStat | undefined {
  // TODO: look up a page by id
  return undefined
}

export function createPage(_input: {
  path: string
  views?: number
  sessions?: number
  bounceRate?: number
}): PageStat {
  // TODO: append a new page with a fresh id and defaults
  return { id: '', path: '', views: 0, sessions: 0, bounceRate: 0, range7d: 0, range30d: 0 }
}

export function updatePage(
  _id: string,
  _patch: { views?: number; sessions?: number; bounceRate?: number },
): PageStat | undefined {
  // TODO: apply the patch and return the updated page, or undefined if absent
  return undefined
}

export function deletePage(_id: string): boolean {
  // TODO: remove the page; return whether it existed
  return false
}
