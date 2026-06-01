export type AccountKind = 'checking' | 'savings'

export type Account = {
  id: string
  name: string
  kind: AccountKind
  balance: number
}

export type Transaction = {
  id: string
  accountId: string
  description: string
  amount: number
}

export type Route = 'accounts' | 'account-detail' | 'transfer' | 'settings'
export type Theme = 'light' | 'dark'
export type Currency = 'USD' | 'EUR' | 'GBP'
