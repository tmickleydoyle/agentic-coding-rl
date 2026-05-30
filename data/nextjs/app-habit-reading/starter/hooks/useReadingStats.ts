'use client'
import { useReading } from '../components/ReadingProvider'
import type { Book, ReadLog } from '../lib/types'

export function sortedDesc(logs: ReadLog[]): ReadLog[] {
  // TODO: most-recent-first by date.
  return logs.slice()
}

export function totalPages(_logs: ReadLog[]): number {
  // TODO: sum of pages.
  return 0
}

export function readingStreak(_logs: ReadLog[], _today: string): number {
  // TODO: consecutive days (ending today/yesterday) with pages > 0.
  return 0
}

export function averagePages(_logs: ReadLog[]): number {
  // TODO: rounded average pages.
  return 0
}

export function booksFinished(_books: Book[]): number {
  // TODO: count of done books.
  return 0
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
