'use client'
import { useState } from 'react'
import { usePlan } from '../../components/AppStateProvider'
import { usePlanViews } from '../../hooks/usePlanViews'
import AssignmentRow from '../../components/AssignmentRow'

export default function DayDetailPage() {
  const { recipes, selectedDay, assign, unassign } = usePlan()
  const { assignmentsFor } = usePlanViews()
  const [recipeId, setRecipeId] = useState(recipes[0]?.id ?? '')

  const rows = assignmentsFor(selectedDay)
  const recipeTitle = (id: string): string =>
    recipes.find((r) => r.id === id)?.title ?? 'Unknown'

  return (
    <section data-testid="page-day-detail">
      <h2 data-testid="day-title">{selectedDay}</h2>
      <div data-testid="assign-form">
        <select
          data-testid="assign-select"
          value={recipeId}
          onChange={(e) => setRecipeId(e.target.value)}
        >
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
        <button data-testid="assign-button" onClick={() => assign(selectedDay, recipeId)}>
          Assign
        </button>
      </div>
      {rows.length === 0 ? (
        <p data-testid="day-empty">No meals planned.</p>
      ) : (
        <ul data-testid="assignment-list">
          {rows.map((a) => (
            <AssignmentRow
              key={a.id}
              assignment={a}
              recipeTitle={recipeTitle(a.recipeId)}
              onRemove={unassign}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
