'use client'
import { useReading } from '../components/ReadingProvider'
import type { Book, ReadLog } from '../lib/types'

export function sortedDesc(logs: ReadLog[]): ReadLog[] {
  return logs.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function totalPages(logs: ReadLog[]): number {
  let total = 0
  logs.forEach((l) => {
    total += l.pages
  })
  return total
}

function prevDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function readingStreak(logs: ReadLog[], today: string): number {
  const byDate = new Map<string, number>()
  logs.forEach((l) => {
    byDate.set(l.date, l.pages)
  })
  const todayPages = byDate.get(today) ?? 0
  let cursor = todayPages > 0 ? today : prevDay(today)
  let streak = 0
  while ((byDate.get(cursor) ?? 0) > 0) {
    streak += 1
    cursor = prevDay(cursor)
  }
  return streak
}

export function averagePages(logs: ReadLog[]): number {
  if (logs.length === 0) return 0
  return Math.round(totalPages(logs) / logs.length)
}

export function booksFinished(books: Book[]): number {
  return books.filter((b) => b.done).length
}

export function useReadingStats() {
  const { logs, books, today } = useReading()
  return {
    total: totalPages(logs),
    streak: readingStreak(logs, today),
    average: averagePages(logs),
    finished: booksFinished(books),
    sorted: sortedDesc(logs),
  }
}
