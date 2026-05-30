'use client'
import { useApp } from '../../components/AppStateProvider'
import DayCell from '../../components/DayCell'
import { useCalendar } from '../../hooks/useCalendar'

export default function MonthPage() {
  const { filter, setFilter, eventsOn, selectDay } = useApp()
  const { cells, categories } = useCalendar()

  return (
    <section data-testid="page-month">
      <h1>Month</h1>
      <label htmlFor="cat">Category</label>
      <select
        id="cat"
        data-testid="category-filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">all</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div data-testid="month-grid">
        {cells.map((cell, idx) =>
          cell === null ? (
            <div key={`blank-${idx}`} data-testid={`cell-blank-${idx}`} />
          ) : (
            <DayCell
              key={cell}
              day={cell}
              count={eventsOn(cell).length}
              onSelect={selectDay}
            />
          ),
        )}
      </div>
    </section>
  )
}
