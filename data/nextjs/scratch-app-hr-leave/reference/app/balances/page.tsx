'use client'
import { useLeave } from '../../hooks/useLeave'

export default function BalancesPage() {
  const { balances } = useLeave()
  return (
    <section data-testid="page-balances">
      <h1>Balances</h1>
      <ul data-testid="balance-list">
        {balances.map((b) => (
          <li key={b.employee.id} data-testid={`balance-${b.employee.id}`}>
            <span data-testid={`balance-${b.employee.id}-name`}>{b.employee.name}</span>
            <span data-testid={`balance-${b.employee.id}-allowance`}>{b.employee.allowance}</span>
            <span data-testid={`balance-${b.employee.id}-used`}>{b.used}</span>
            <span data-testid={`balance-${b.employee.id}-remaining`}>{b.remaining}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
