'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Account, Currency, Route, Theme, Transaction } from '../lib/types'

type TransferInput = { fromId: string; toId: string; amount: number }
type TransferResult = { ok: true } | { ok: false; error: string }

type AccountsApi = {
  accounts: Account[]
  transactions: Transaction[]
  theme: Theme
  currency: Currency
  route: Route
  selectedId: string | null
  transfer: (input: TransferInput) => TransferResult
  select: (id: string) => void
  setTheme: (theme: Theme) => void
  setCurrency: (currency: Currency) => void
  navigate: (route: Route) => void
}

const AccountsContext = createContext<AccountsApi | null>(null)

const SEED_ACCOUNTS: Account[] = [
  { id: 'a1', name: 'Everyday Checking', kind: 'checking', balance: 2500 },
  { id: 'a2', name: 'Rainy Day Savings', kind: 'savings', balance: 8000 },
  { id: 'a3', name: 'Travel Fund', kind: 'savings', balance: 1200 },
]

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'a1', description: 'Paycheck', amount: 3200 },
  { id: 't2', accountId: 'a1', description: 'Rent', amount: -1400 },
  { id: 't3', accountId: 'a1', description: 'Groceries', amount: -260 },
  { id: 't4', accountId: 'a2', description: 'Interest', amount: 40 },
  { id: 't5', accountId: 'a2', description: 'Deposit', amount: 500 },
  { id: 't6', accountId: 'a3', description: 'Flights', amount: -300 },
]

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(SEED_ACCOUNTS)
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS)
  const [theme, setTheme] = useState<Theme>('light')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [route, setRoute] = useState<Route>('accounts')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextTxnId, setNextTxnId] = useState(7)

  const value = useMemo<AccountsApi>(() => {
    const transfer = (input: TransferInput): TransferResult => {
      if (input.fromId === input.toId) return { ok: false, error: 'same account' }
      if (!(input.amount > 0)) return { ok: false, error: 'amount must be positive' }
      const from = accounts.find((a) => a.id === input.fromId)
      const to = accounts.find((a) => a.id === input.toId)
      if (!from || !to) return { ok: false, error: 'unknown account' }
      if (from.balance < input.amount) return { ok: false, error: 'insufficient funds' }

      const outId = `t${nextTxnId}`
      const inId = `t${nextTxnId + 1}`
      setNextTxnId((n) => n + 2)
      setAccounts((prev) =>
        prev.map((a) => {
          if (a.id === input.fromId) return { ...a, balance: a.balance - input.amount }
          if (a.id === input.toId) return { ...a, balance: a.balance + input.amount }
          return a
        }),
      )
      setTransactions((prev) => [
        ...prev,
        {
          id: outId,
          accountId: input.fromId,
          description: `Transfer to ${to.name}`,
          amount: -input.amount,
        },
        {
          id: inId,
          accountId: input.toId,
          description: `Transfer from ${from.name}`,
          amount: input.amount,
        },
      ])
      return { ok: true }
    }

    const select = (id: string) => {
      setSelectedId(id)
      setRoute('account-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      accounts,
      transactions,
      theme,
      currency,
      route,
      selectedId,
      transfer,
      select,
      setTheme,
      setCurrency,
      navigate,
    }
  }, [accounts, transactions, theme, currency, route, selectedId, nextTxnId])

  return <AccountsContext.Provider value={value}>{children}</AccountsContext.Provider>
}

export function useAccounts(): AccountsApi {
  const v = useContext(AccountsContext)
  if (!v) throw new Error('useAccounts must be used within an AccountsProvider')
  return v
}
