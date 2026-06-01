'use client'
import { useMood } from '../../components/MoodProvider'

export default function TodayPage() {
  const { entries, today } = useMood()
  const todayEntry = entries.find((e) => e.date === today)
  const logged = !!todayEntry

  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <p data-testid="today-date">{today}</p>
      <p data-testid="today-score">{logged ? todayEntry!.score : '-'}</p>
      <p data-testid="today-logged" data-logged={logged ? 'true' : 'false'}>
        {logged ? 'Logged' : 'Not logged yet'}
      </p>
      {logged ? (
        <p data-testid="today-triggers">{todayEntry!.triggers.join(', ')}</p>
      ) : null}
    </section>
  )
}
