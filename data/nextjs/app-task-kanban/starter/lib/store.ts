import type { Card, Column } from './types'
import { COLUMNS } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `cards` + an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function isColumn(value: unknown): value is Column {
  return typeof value === 'string' && (COLUMNS as string[]).includes(value)
}

export function listCards(_filter?: { column?: string | null; archived?: string | null }): Card[] {
  // TODO: return cards, applying optional column + archived filters
  return []
}

export function createCard(_input: { title: string }): Card {
  // TODO: append a new backlog card with a fresh id and return it
  return { id: '', title: '', column: 'backlog', archived: false }
}

export function findCard(_id: string): Card | undefined {
  // TODO: look up a card by id
  return undefined
}

export function updateCard(
  _id: string,
  _patch: { column?: Column; archived?: boolean },
): Card | undefined {
  // TODO: apply the patch and return the updated card, or undefined if absent
  return undefined
}

export function deleteCard(_id: string): boolean {
  // TODO: remove the card; return whether it existed
  return false
}
