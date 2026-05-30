import type { Note, Notebook } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let notebooks: Notebook[] = []
let notes: Note[] = []
let nextNoteId = 1

function seed(): void {
  notebooks = [
    { id: 'nb1', name: 'Personal' },
    { id: 'nb2', name: 'Work' },
  ]
  notes = [
    { id: 'n1', notebookId: 'nb1', title: 'Grocery list', body: 'Milk and eggs', tags: ['errand'], pinned: false },
    { id: 'n2', notebookId: 'nb2', title: 'Sprint goals', body: 'Ship the editor', tags: ['planning'], pinned: true },
    { id: 'n3', notebookId: 'nb1', title: 'Book ideas', body: 'A novel about notebooks', tags: ['writing', 'fun'], pinned: false },
  ]
  nextNoteId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listNotes(filter?: {
  notebookId?: string | null
  tag?: string | null
  q?: string | null
}): Note[] {
  let out = notes.slice()
  const notebookId = filter?.notebookId
  if (notebookId) out = out.filter((n) => n.notebookId === notebookId)
  const tag = filter?.tag
  if (tag) out = out.filter((n) => n.tags.includes(tag))
  const q = filter?.q
  if (q && q.trim().length > 0) {
    const needle = q.toLowerCase()
    out = out.filter(
      (n) =>
        n.title.toLowerCase().includes(needle) ||
        n.body.toLowerCase().includes(needle),
    )
  }
  return out
}

export function createNote(input: {
  notebookId?: string
  title: string
  body?: string
  tags?: string[]
}): Note {
  const note: Note = {
    id: `n${nextNoteId++}`,
    notebookId: input.notebookId ?? 'nb1',
    title: input.title,
    body: input.body ?? '',
    tags: input.tags ?? [],
    pinned: false,
  }
  notes.push(note)
  return note
}

export function findNote(id: string): Note | undefined {
  return notes.find((n) => n.id === id)
}

export function updateNote(
  id: string,
  patch: { title?: string; body?: string; tags?: string[]; pinned?: boolean },
): Note | undefined {
  const note = notes.find((n) => n.id === id)
  if (!note) return undefined
  if (typeof patch.title === 'string') note.title = patch.title
  if (typeof patch.body === 'string') note.body = patch.body
  if (Array.isArray(patch.tags)) note.tags = patch.tags
  if (typeof patch.pinned === 'boolean') note.pinned = patch.pinned
  return note
}

export function deleteNote(id: string): boolean {
  const idx = notes.findIndex((n) => n.id === id)
  if (idx === -1) return false
  notes.splice(idx, 1)
  return true
}

export function listNotebooks(): Notebook[] {
  return notebooks.slice()
}
