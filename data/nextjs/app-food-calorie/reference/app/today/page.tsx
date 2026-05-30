'use client'
import { useApp } from '../../components/AppStateProvider'
import { useNutrition } from '../../hooks/useNutrition'
import MacroBar from '../../components/MacroBar'
import MealItem from '../../components/MealItem'

export default function TodayPage() {
  const { goal, removeMeal } = useApp()
  const { todayMeals, todayTotals, remaining } = useNutrition()
  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <div data-testid="calorie-total">
        <span data-testid="calorie-total-value">{todayTotals.calories}</span>
        <span data-testid="calorie-goal-value">{goal.calories}</span>
        <span data-testid="calorie-remaining-value">{remaining}</span>
        <span data-testid="calorie-status" data-ontrack={remaining >= 0 ? 'true' : 'false'}>
          {remaining >= 0 ? 'on-track' : 'over'}
        </span>
      </div>
      <div data-testid="macros">
        <MacroBar label="Protein" value={todayTotals.protein} goal={goal.protein} testid="protein" />
        <MacroBar label="Carbs" value={todayTotals.carbs} goal={goal.carbs} testid="carbs" />
        <MacroBar label="Fat" value={todayTotals.fat} goal={goal.fat} testid="fat" />
      </div>
      {todayMeals.length === 0 ? (
        <p data-testid="empty-state">No meals logged today.</p>
      ) : (
        <ul data-testid="meal-list">
          {todayMeals.map((m) => (
            <MealItem key={m.id} meal={m} onRemove={removeMeal} />
          ))}
        </ul>
      )}
    </section>
  )
}
