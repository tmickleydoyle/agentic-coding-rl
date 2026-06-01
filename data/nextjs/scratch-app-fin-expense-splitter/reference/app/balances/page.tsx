'use client'
import { useBalances } from '../../hooks/useBalances'

export default function BalancesPage() {
  const { balances, settlements } = useBalances()
  return (
    <section data-testid="page-balances">
      <h1>Balances</h1>
      <ul data-testid="balance-list">
        {balances.map((b) => (
          <li
            key={b.id}
            data-testid={`balance-${b.id}`}
            data-status={b.net > 0 ? 'owed' : b.net < 0 ? 'owes' : 'settled'}
          >
            <span data-testid={`balance-${b.id}-name`}>{b.name}</span>
            <span data-testid={`balance-${b.id}-net`}>{b.net}</span>
          </li>
        ))}
      </ul>
      {settlements.length === 0 ? (
        <p data-testid="all-settled">Everyone is settled up.</p>
      ) : (
        <ul data-testid="settlement-list">
          {settlements.map((s, i) => (
            <li key={`${s.fromId}-${s.toId}-${i}`} data-testid={`settlement-${i}`}>
              <span data-testid={`settlement-${i}-from`}>{s.fromName}</span>
              <span data-testid={`settlement-${i}-to`}>{s.toName}</span>
              <span data-testid={`settlement-${i}-amount`}>{s.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
