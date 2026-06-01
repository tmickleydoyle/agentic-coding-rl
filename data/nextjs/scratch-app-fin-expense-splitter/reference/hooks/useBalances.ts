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

export function computeBalances(people: Person[], expenses: Expense[]): Balance[] {
  const n = people.length
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const perHead = n > 0 ? total / n : 0
  const paidBy: Record<string, number> = {}
  people.forEach((p) => {
    paidBy[p.id] = 0
  })
  expenses.forEach((e) => {
    if (paidBy[e.paidBy] !== undefined) paidBy[e.paidBy] += e.amount
  })
  return people.map((p) => {
    const paid = paidBy[p.id] ?? 0
    return { id: p.id, name: p.name, paid, share: perHead, net: paid - perHead }
  })
}

export function settleUp(balances: Balance[]): Settlement[] {
  const debtors = balances
    .filter((b) => b.net < -1e-9)
    .map((b) => ({ id: b.id, name: b.name, amount: -b.net }))
  const creditors = balances
    .filter((b) => b.net > 1e-9)
    .map((b) => ({ id: b.id, name: b.name, amount: b.net }))
  const settlements: Settlement[] = []
  let i = 0
  let j = 0
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const amount = Math.min(debtor.amount, creditor.amount)
    settlements.push({
      fromId: debtor.id,
      fromName: debtor.name,
      toId: creditor.id,
      toName: creditor.name,
      amount: Math.round(amount * 100) / 100,
    })
    debtor.amount -= amount
    creditor.amount -= amount
    if (debtor.amount < 1e-9) i += 1
    if (creditor.amount < 1e-9) j += 1
  }
  return settlements
}

export function useBalances() {
  const { people, expenses } = useSplit()
  const balances = computeBalances(people, expenses)
  const settlements = settleUp(balances)
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  return { balances, settlements, total }
}
