'use client'
import { useSplit } from '../components/SplitProvider'
import type { Expense, Person } from '../lib/types'

export type Balance = {
  id: string
  name: string
  paid: number
  share: number
  net: number
}

export type Settlement = {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amount: number
}

export function computeBalances(_people: Person[], _expenses: Expense[]): Balance[] {
  // TODO: split total spend equally; net = paid - share per person
  return []
}

export function settleUp(_balances: Balance[]): Settlement[] {
  // TODO: greedily match debtors to creditors into minimal transfers
  return []
}

export function useBalances() {
  const { people, expenses } = useSplit()
  const balances = computeBalances(people, expenses)
  const settlements = settleUp(balances)
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  return { balances, settlements, total }
}
