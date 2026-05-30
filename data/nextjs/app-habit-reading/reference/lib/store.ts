import type { Book, ReadLog } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let logs: ReadLog[] = []
let books: Book[] = []
let nextId = 1

function seed(): void {
  logs = [
    { id: 'l1', date: '2026-05-26', pages: 30 },
    { id: 'l2', date: '2026-05-27', pages: 45 },
    { id: 'l3', date: '2026-05-28', pages: 20 },
  ]
  books = [
    { id: 'b1', title: 'Dune', done: true },
    { id: 'b2', title: '1984', done: false },
    { id: 'b3', title: 'Hyperion', done: true },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listLogs(): ReadLog[] {
  return logs.slice()
}

export function listBooks(): Book[] {
  return books.map((b) => ({ ...b }))
}

export function upsertLog(input: { date: string; pages: number }): ReadLog {
  const existing = logs.find((l) => l.date === input.date)
  if (existing) {
    existing.pages = input.pages
    return existing
  }
  const log: ReadLog = { id: `l${nextId++}`, date: input.date, pages: input.pages }
  logs.push(log)
  return log
}

export function deleteLog(id: string): boolean {
  const idx = logs.findIndex((l) => l.id === id)
  if (idx === -1) return false
  logs.splice(idx, 1)
  return true
}

export function toggleBook(id: string): Book | undefined {
  const book = books.find((b) => b.id === id)
  if (!book) return undefined
  book.done = !book.done
  return { ...book }
}
