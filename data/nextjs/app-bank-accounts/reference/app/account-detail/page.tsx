'use client'
import { useAccounts } from '../../components/AccountsProvider'
import { accountStats, transactionsFor } from '../../hooks/useAccounts'
import StatCard from '../../components/StatCard'

export default function AccountDetailPage() {
  const { accounts, transactions, selectedId } = useAccounts()
  const account = accounts.find((a) => a.id === selectedId)

  if (!account) {
    return (
      <section data-testid="page-account-detail">
        <p data-testid="no-selection">No account selected.</p>
      </section>
    )
  }

  const txns = transactionsFor(transactions, account.id)
  const stats = accountStats(transactions, account.id)

  return (
    <section data-testid="page-account-detail">
      <h1 data-testid="account-name">{account.name}</h1>
      <p data-testid="account-balance">{account.balance}</p>
      <div data-testid="stats">
        <StatCard label="Deposits" value={stats.deposits} testid="deposits" />
        <StatCard label="Withdrawals" value={stats.withdrawals} testid="withdrawals" />
        <StatCard label="Transactions" value={stats.count} testid="count" />
      </div>
      {txns.length === 0 ? (
        <p data-testid="no-txns">No transactions.</p>
      ) : (
        <ul data-testid="txn-list">
          {txns.map((t) => (
            <li
              key={t.id}
              data-testid={`txn-${t.id}`}
              data-kind={t.amount >= 0 ? 'deposit' : 'withdrawal'}
            >
              <span data-testid={`txn-${t.id}-desc`}>{t.description}</span>
              <span data-testid={`txn-${t.id}-amount`}>{t.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
