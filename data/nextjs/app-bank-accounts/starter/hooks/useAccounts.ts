'use client'
import { useAccounts } from '../components/AccountsProvider'
import type { Account, Transaction } from '../lib/types'

export type AccountStats = {
  deposits: number
  withdrawals: number
  count: number
}

export type AccountsTotals = {
  total: number
  accountCount: number
}

export function totalBalance(_accounts: Account[]): number {
  // TODO: sum all account balances
  return 0
}

export function transactionsFor(
  _transactions: Transaction[],
  _accountId: string,
): Transaction[] {
  // TODO: return that account's transactions in order
  return []
}

export function accountStats(
  _transactions: Transaction[],
  _accountId: string,
): AccountStats {
  // TODO: deposits = sum of positive amounts, withdrawals = sum of |negatives|, count
  return { deposits: 0, withdrawals: 0, count: 0 }
}

export function useAccountsSummary(): AccountsTotals {
  const { accounts } = useAccounts()
  return { total: totalBalance(accounts), accountCount: accounts.length }
}
