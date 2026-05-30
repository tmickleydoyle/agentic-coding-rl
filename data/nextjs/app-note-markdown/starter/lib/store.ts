import type { Note } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `notes` and an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listNotes(_filter?: { tag?: string | null; q?: string | null }): Note[] {
  // TODO: return notes, applying optional tag + q filters
  return []
}

export function renderNote(note: Note): Note & { html: string } {
  // TODO: attach rendered html to the note
  return { ...note, html: '' }
}

export function createNote(_input: { title: string; body?: string; tags?: string[] }): Note {
  // TODO: append a new note with a fresh id and return it
  return { id: '', title: '', body: '', tags: [] }
}

export function findNote(_id: string): Note | undefined {
  // TODO: look up a note by id
  return undefined
}

export function updateNote(
  _id: string,
  _patch: { title?: string; body?: string; tags?: string[] },
): Note | undefined {
  // TODO: apply the patch and return the updated note, or undefined if absent
  return undefined
}

export function deleteNote(_id: string): boolean {
  // TODO: remove the note; return whether it existed
  return false
}
