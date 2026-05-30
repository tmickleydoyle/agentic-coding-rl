'use client'
import { useReading } from '../../components/ReadingProvider'
import { readingStreak } from '../../hooks/useReadingStats'

export default function TodayPage() {
  const { logs, today } = useReading()
  const todayLog = logs.find((l) => l.date === today)
  const pages = todayLog?.pages ?? 0
  const logged = !!todayLog
  const streak = readingStreak(logs, today)

  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <p data-testid="today-date">{today}</p>
      <p data-testid="today-pages">{pages}</p>
      <p data-testid="today-streak">{streak}</p>
      <p data-testid="today-logged" data-logged={logged ? 'true' : 'false'}>
        {logged ? 'Logged' : 'Not logged yet'}
      </p>
    </section>
  )
}
