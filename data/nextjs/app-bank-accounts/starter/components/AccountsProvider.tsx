'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AccountsApi = {
  accounts: [],
  transactions: [],
  theme: 'light',
  currency: 'USD',
  route: 'accounts',
  selectedId: null,
  transfer: () => ({ ok: false, error: 'not implemented' }),
  select: () => {},
  setTheme: () => {},
  setCurrency: () => {},
  navigate: () => {},
}

export function AccountsProvider({ children }: { children: ReactNode }) {
  // TODO: hold accounts/transactions/theme/currency/route/selectedId in state (seed 3
  // accounts + 6 transactions), implement transfer (validate funds), select, and navigation.
  // The STUB below makes the app mount but does nothing — replace it with real state.
  return <AccountsContext.Provider value={STUB}>{children}</AccountsContext.Provider>
}

export function useAccounts(): AccountsApi {
  const v = useContext(AccountsContext)
  if (!v) throw new Error('useAccounts must be used within an AccountsProvider')
  return v
}
