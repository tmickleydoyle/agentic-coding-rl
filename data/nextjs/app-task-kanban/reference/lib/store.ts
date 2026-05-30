import type { Card, Column } from './types'
import { COLUMNS } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// BoardProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let cards: Card[] = []
let nextCardId = 1

function seed(): void {
  cards = [
    { id: 'c1', title: 'Set up repo', column: 'backlog', archived: false },
    { id: 'c2', title: 'Write tests', column: 'doing', archived: false },
    { id: 'c3', title: 'Draft API', column: 'doing', archived: false },
    { id: 'c4', title: 'Ship v1', column: 'done', archived: false },
  ]
  nextCardId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function isColumn(value: unknown): value is Column {
  return typeof value === 'string' && (COLUMNS as string[]).includes(value)
}

export function listCards(filter?: { column?: string | null; archived?: string | null }): Card[] {
  let out = cards.slice()
  const column = filter?.column
  if (column) out = out.filter((c) => c.column === column)
  const archived = filter?.archived
  if (archived === 'true') out = out.filter((c) => c.archived)
  else if (archived === 'false') out = out.filter((c) => !c.archived)
  return out
}

export function createCard(input: { title: string }): Card {
  const card: Card = {
    id: `c${nextCardId++}`,
    title: input.title,
    column: 'backlog',
    archived: false,
  }
  cards.push(card)
  return card
}

export function findCard(id: string): Card | undefined {
  return cards.find((c) => c.id === id)
}

export function updateCard(
  id: string,
  patch: { column?: Column; archived?: boolean },
): Card | undefined {
  const card = cards.find((c) => c.id === id)
  if (!card) return undefined
  if (patch.column !== undefined) card.column = patch.column
  if (typeof patch.archived === 'boolean') card.archived = patch.archived
  return card
}

export function deleteCard(id: string): boolean {
  const idx = cards.findIndex((c) => c.id === id)
  if (idx === -1) return false
  cards.splice(idx, 1)
  return true
}
