'use client'
import { useExpenses } from '../../components/ExpensesProvider'
import { useTripExpenses } from '../../hooks/useExpenseStats'
import ExpenseRow from '../../components/ExpenseRow'

export default function ExpensesPage() {
  const { selectedTripId, removeExpense, navigate } = useExpenses()
  const { trip, days, total } = useTripExpenses(selectedTripId)

  if (!trip) {
    return (
      <section data-testid="page-expenses">
        <p data-testid="no-trip">No trip selected.</p>
        <button data-testid="back-to-trips" onClick={() => navigate('trips')}>
          Back
        </button>
      </section>
    )
  }

  return (
    <section data-testid="page-expenses">
      <h1 data-testid="expenses-name">{trip.name}</h1>
      <p data-testid="expenses-total">{total}</p>
      {days.map((d) => (
        <div key={d.day} data-testid={`day-${d.day}`}>
          <h2 data-testid={`day-${d.day}-label`}>Day {d.day}</h2>
          <span data-testid={`day-${d.day}-total`}>{d.total}</span>
          {d.expenses.length === 0 ? (
            <p data-testid={`day-${d.day}-empty`}>Nothing spent.</p>
          ) : (
            <ul data-testid={`day-${d.day}-list`}>
              {d.expenses.map((e) => (
                <ExpenseRow key={e.id} expense={e} onRemove={removeExpense} />
              ))}
            </ul>
          )}
        </div>
      ))}
      <button data-testid="add-link" onClick={() => navigate('add')}>
        Add expense
      </button>
    </section>
  )
}
