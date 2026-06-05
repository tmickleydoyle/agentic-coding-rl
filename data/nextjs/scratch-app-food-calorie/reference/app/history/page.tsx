'use client'
import { useNutrition, sumMeals } from '../../hooks/useNutrition'
import MealItem from '../../components/MealItem'

export default function HistoryPage() {
  const { days } = useNutrition()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      {days.length === 0 ? (
        <p data-testid="empty-state">No history yet.</p>
      ) : (
        <ul data-testid="day-list">
          {days.map((d) => {
            const totals = sumMeals(d.meals)
            return (
              <li key={d.date} data-testid={`day-${d.date}`}>
                <span data-testid={`day-${d.date}-date`}>{d.date}</span>
                <span data-testid={`day-${d.date}-calories`}>{totals.calories}</span>
                <span data-testid={`day-${d.date}-count`}>{d.meals.length}</span>
                <ul data-testid={`day-${d.date}-meals`}>
                  {d.meals.map((m) => (
                    <MealItem key={m.id} meal={m} />
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
