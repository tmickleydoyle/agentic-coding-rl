'use client'
import { useBills } from '../../components/BillsProvider'
import { useBillsSummary } from '../../hooks/useBills'
import StatCard from '../../components/StatCard'
import BillRow from '../../components/BillRow'

export default function BillsPage() {
  const { bills } = useBills()
  const { totals } = useBillsSummary()
  return (
    <section data-testid="page-bills">
      <h1>Bills</h1>
      <div data-testid="stats">
        <StatCard label="Total" value={totals.total} testid="total" />
        <StatCard label="Paid" value={totals.paidCount} testid="paid" />
        <StatCard label="Unpaid" value={totals.unpaidCount} testid="unpaid" />
        <StatCard label="Autopay" value={totals.autopayCount} testid="autopay" />
      </div>
      {bills.length === 0 ? (
        <p data-testid="empty-bills">No bills yet.</p>
      ) : (
        <ul data-testid="bill-list">
          {bills.map((b) => (
            <BillRow key={b.id} bill={b} />
          ))}
        </ul>
      )}
    </section>
  )
}
