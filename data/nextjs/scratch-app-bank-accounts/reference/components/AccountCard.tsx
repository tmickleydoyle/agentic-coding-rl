'use client'
import { useAccounts } from './AccountsProvider'
import type { Account } from '../lib/types'

export default function AccountCard({ account }: { account: Account }) {
  const { select } = useAccounts()
  return (
    <li data-testid={`account-${account.id}`}>
      <span data-testid={`account-${account.id}-name`}>{account.name}</span>
      <span data-testid={`account-${account.id}-kind`}>{account.kind}</span>
      <span data-testid={`account-${account.id}-balance`}>{account.balance}</span>
      <button data-testid={`account-${account.id}-open`} onClick={() => select(account.id)}>
        Open
      </button>
    </li>
  )
}
