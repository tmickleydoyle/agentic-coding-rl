'use client'
import { useAccounts } from '../../components/AccountsProvider'
import { useAccountsSummary } from '../../hooks/useAccounts'
import AccountCard from '../../components/AccountCard'

export default function AccountsPage() {
  const { accounts, currency } = useAccounts()
  const { total } = useAccountsSummary()
  return (
    <section data-testid="page-accounts">
      <h1>Accounts</h1>
      <p data-testid="currency-label">{currency}</p>
      <p data-testid="total-balance">{total}</p>
      {accounts.length === 0 ? (
        <p data-testid="empty-accounts">No accounts yet.</p>
      ) : (
        <ul data-testid="account-list">
          {accounts.map((a) => (
            <AccountCard key={a.id} account={a} />
          ))}
        </ul>
      )}
    </section>
  )
}
