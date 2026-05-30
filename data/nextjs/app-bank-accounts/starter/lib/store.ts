import type { Account, AccountKind, Transaction } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `accounts`, `transactions`, and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

const KINDS: AccountKind[] = ['checking', 'savings']

export function isKind(value: unknown): value is AccountKind {
  return typeof value === 'string' && KINDS.indexOf(value as AccountKind) !== -1
}

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listAccounts(): Account[] {
  // TODO: return all accounts
  return []
}

export function findAccount(_id: string): Account | undefined {
  // TODO: look up an account by id
  return undefined
}

export function createAccount(_input: {
  name: string
  kind?: AccountKind
  balance?: number
}): Account {
  // TODO: append a new account with a fresh id and return it
  return { id: '', name: '', kind: 'checking', balance: 0 }
}

export function listTransactions(_filter?: { accountId?: string | null }): Transaction[] {
  // TODO: return transactions, applying optional accountId filter
  return []
}

export function createTransaction(_input: {
  accountId: string
  description?: string
  amount: number
}): Transaction {
  // TODO: append a new transaction with a fresh id, adjust the account balance, return it
  return { id: '', accountId: '', description: '', amount: 0 }
}

export function findTransaction(_id: string): Transaction | undefined {
  // TODO: look up a transaction by id
  return undefined
}

export function deleteTransaction(_id: string): boolean {
  // TODO: remove the transaction, reverse its balance effect; return whether it existed
  return false
}
