import type { Account, AccountKind, Transaction } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// AccountsProvider state. Tests call __reset() in beforeEach for isolation.

let accounts: Account[] = []
let transactions: Transaction[] = []
let nextAccountId = 1
let nextTransactionId = 1

function seed(): void {
  accounts = [
    { id: 'a1', name: 'Everyday Checking', kind: 'checking', balance: 2500 },
    { id: 'a2', name: 'Rainy Day Savings', kind: 'savings', balance: 8000 },
    { id: 'a3', name: 'Travel Fund', kind: 'savings', balance: 1200 },
  ]
  transactions = [
    { id: 't1', accountId: 'a1', description: 'Paycheck', amount: 3200 },
    { id: 't2', accountId: 'a1', description: 'Rent', amount: -1400 },
    { id: 't3', accountId: 'a1', description: 'Groceries', amount: -260 },
    { id: 't4', accountId: 'a2', description: 'Interest', amount: 40 },
    { id: 't5', accountId: 'a2', description: 'Deposit', amount: 500 },
    { id: 't6', accountId: 'a3', description: 'Flights', amount: -300 },
  ]
  nextAccountId = 4
  nextTransactionId = 7
}

seed()

export function __reset(): void {
  seed()
}

export function listAccounts(): Account[] {
  return accounts.slice()
}

export function findAccount(id: string): Account | undefined {
  return accounts.find((a) => a.id === id)
}

const KINDS: AccountKind[] = ['checking', 'savings']

export function isKind(value: unknown): value is AccountKind {
  return typeof value === 'string' && KINDS.indexOf(value as AccountKind) !== -1
}

export function createAccount(input: {
  name: string
  kind?: AccountKind
  balance?: number
}): Account {
  const account: Account = {
    id: `a${nextAccountId++}`,
    name: input.name,
    kind: input.kind ?? 'checking',
    balance: input.balance ?? 0,
  }
  accounts.push(account)
  return account
}

export function listTransactions(filter?: { accountId?: string | null }): Transaction[] {
  let out = transactions.slice()
  const accountId = filter?.accountId
  if (accountId) out = out.filter((t) => t.accountId === accountId)
  return out
}

export function createTransaction(input: {
  accountId: string
  description?: string
  amount: number
}): Transaction {
  const txn: Transaction = {
    id: `t${nextTransactionId++}`,
    accountId: input.accountId,
    description: input.description ?? '',
    amount: input.amount,
  }
  transactions.push(txn)
  const account = findAccount(input.accountId)
  if (account) account.balance += input.amount
  return txn
}

export function findTransaction(id: string): Transaction | undefined {
  return transactions.find((t) => t.id === id)
}

export function deleteTransaction(id: string): boolean {
  const idx = transactions.findIndex((t) => t.id === id)
  if (idx === -1) return false
  const txn = transactions[idx]
  const account = findAccount(txn.accountId)
  if (account) account.balance -= txn.amount
  transactions.splice(idx, 1)
  return true
}
