'use client'
import { useAccounts } from './AccountsProvider'
import type { Account } from '../lib/types'

export default function AccountCard({ account }: { account: Account }) {
  const { select } = useAccounts()
  // TODO: render account name/kind/balance and an open button that calls select(id).
  void select
  void account
  return <li data-testid={`account-${account.id}`} />
}
