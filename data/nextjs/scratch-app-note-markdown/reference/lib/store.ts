import type { Note } from './types'
import { renderMarkdown } from './markdown'

let notes: Note[] = []
let nextId = 1

function seed(): void {
  notes = [
    { id: 'm1', title: 'Welcome', body: '# Hello\n\nThis is **bold**.', tags: ['intro'] },
    { id: 'm2', title: 'Todo', body: '- one\n- two', tags: ['task', 'daily'] },
    { id: 'm3', title: 'Reference', body: 'Use `code` here', tags: ['intro', 'docs'] },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listNotes(filter?: { tag?: string | null; q?: string | null }): Note[] {
  let out = notes.slice()
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

export function renderNote(note: Note): Note & { html: string } {
  return { ...note, html: renderMarkdown(note.body) }
}

export function createNote(input: { title: string; body?: string; tags?: string[] }): Note {
  const note: Note = {
    id: `m${nextId++}`,
    title: input.title,
    body: input.body ?? '',
    tags: input.tags ?? [],
  }
  notes.push(note)
  return note
}

export function findNote(id: string): Note | undefined {
  return notes.find((n) => n.id === id)
}

export function updateNote(
  id: string,
  patch: { title?: string; body?: string; tags?: string[] },
): Note | undefined {
  const note = notes.find((n) => n.id === id)
  if (!note) return undefined
  if (typeof patch.title === 'string') note.title = patch.title
  if (typeof patch.body === 'string') note.body = patch.body
  if (Array.isArray(patch.tags)) note.tags = patch.tags
  return note
}

export function deleteNote(id: string): boolean {
  const idx = notes.findIndex((n) => n.id === id)
  if (idx === -1) return false
  notes.splice(idx, 1)
  return true
}
