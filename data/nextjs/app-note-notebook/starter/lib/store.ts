import type { Note, Notebook } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `notebooks`, `notes`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listNotes(_filter?: {
  notebookId?: string | null
  tag?: string | null
  q?: string | null
}): Note[] {
  // TODO: return notes, applying optional notebookId + tag + q filters
  return []
}

export function createNote(_input: {
  notebookId?: string
  title: string
  body?: string
  tags?: string[]
}): Note {
  // TODO: append a new note with a fresh id and return it
  return { id: '', notebookId: '', title: '', body: '', tags: [], pinned: false }
}

export function findNote(_id: string): Note | undefined {
  // TODO: look up a note by id
  return undefined
}

export function updateNote(
  _id: string,
  _patch: { title?: string; body?: string; tags?: string[]; pinned?: boolean },
): Note | undefined {
  // TODO: apply the patch and return the updated note, or undefined if absent
  return undefined
}

export function deleteNote(_id: string): boolean {
  // TODO: remove the note; return whether it existed
  return false
}

export function listNotebooks(): Notebook[] {
  // TODO: return all notebooks
  return []
}
