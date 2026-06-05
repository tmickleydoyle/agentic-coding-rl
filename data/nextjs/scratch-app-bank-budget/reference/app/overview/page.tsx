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
        <StatCard label="Limit" value={totals.totalLimit} testid="limit" />
        <StatCard label="Spent" value={totals.totalSpent} testid="spent" />
        <StatCard label="Remaining" value={totals.totalRemaining} testid="remaining" />
        <StatCard label="Over limit" value={totals.overLimitCount} testid="overlimit" />
      </div>
      {totals.overLimitCount > 0 ? (
        <p data-testid="overall-alert">
          {totals.overLimitCount} categor{totals.overLimitCount === 1 ? 'y is' : 'ies are'} over limit
        </p>
      ) : (
        <p data-testid="overall-ok">All categories within limit</p>
      )}
    </section>
  )
}
