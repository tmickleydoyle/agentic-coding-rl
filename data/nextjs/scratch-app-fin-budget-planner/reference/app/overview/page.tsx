'use client'
import { useBudget } from '../../components/BudgetProvider'
import { useBudgetSummary } from '../../hooks/useBudget'
import StatCard from '../../components/StatCard'

export default function OverviewPage() {
  const { currency } = useBudget()
  const { totals } = useBudgetSummary()
  return (
    <section data-testid="page-overview">
      <h1>Overview</h1>
      <p data-testid="currency-label">{currency}</p>
      <div data-testid="stats">
        <StatCard label="Planned" value={totals.totalPlanned} testid="planned" />
        <StatCard label="Actual" value={totals.totalActual} testid="actual" />
        <StatCard label="Remaining" value={totals.totalRemaining} testid="remaining" />
        <StatCard label="Over budget" value={totals.overBudgetCount} testid="overbudget" />
      </div>
      {totals.overBudgetCount > 0 ? (
        <p data-testid="overall-alert">
          {totals.overBudgetCount} categor{totals.overBudgetCount === 1 ? 'y is' : 'ies are'} over budget
        </p>
      ) : (
        <p data-testid="overall-ok">All categories within budget</p>
      )}
    </section>
  )
}
