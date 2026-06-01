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

export function totalBalance(accounts: Account[]): number {
  let total = 0
  accounts.forEach((a) => {
    total += a.balance
  })
  return total
}

export function transactionsFor(
  transactions: Transaction[],
  accountId: string,
): Transaction[] {
  return transactions.filter((t) => t.accountId === accountId)
}

export function accountStats(
  transactions: Transaction[],
  accountId: string,
): AccountStats {
  let deposits = 0
  let withdrawals = 0
  let count = 0
  transactions.forEach((t) => {
    if (t.accountId !== accountId) return
    count += 1
    if (t.amount >= 0) deposits += t.amount
    else withdrawals += Math.abs(t.amount)
  })
  return { deposits, withdrawals, count }
}

export function useAccountsSummary(): AccountsTotals {
  const { accounts } = useAccounts()
  return { total: totalBalance(accounts), accountCount: accounts.length }
}
