'use client'
import { usePlan } from '../../components/AppStateProvider'
import { usePlanViews } from '../../hooks/usePlanViews'
import DayCell from '../../components/DayCell'
import { DAYS } from '../../lib/types'

export default function WeekPage() {
  const { selectDay } = usePlan()
  const { mealCount } = usePlanViews()
  return (
    <section data-testid="page-week">
      <h1>Week</h1>
      <div data-testid="week-grid">
        {DAYS.map((d) => (
          <DayCell key={d} day={d} count={mealCount(d)} onOpen={selectDay} />
        ))}
      </div>
    </section>
  )
}
