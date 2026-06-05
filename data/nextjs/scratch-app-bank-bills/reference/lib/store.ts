import type { Bill } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// BillsProvider state. Tests call __reset() in beforeEach for isolation.

let bills: Bill[] = []
let nextBillId = 1

function seed(): void {
  bills = [
    { id: 'b1', name: 'Rent', amount: 1400, dueDay: 1, paid: false, autopay: false },
    { id: 'b2', name: 'Internet', amount: 60, dueDay: 5, paid: true, autopay: true },
    { id: 'b3', name: 'Phone', amount: 45, dueDay: 15, paid: false, autopay: true },
    { id: 'b4', name: 'Gym', amount: 30, dueDay: 20, paid: false, autopay: false },
  ]
  nextBillId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listBills(filter?: { unpaid?: boolean }): Bill[] {
  let out = bills.slice()
  if (filter?.unpaid) out = out.filter((b) => !b.paid)
  return out
}

export function findBill(id: string): Bill | undefined {
  return bills.find((b) => b.id === id)
}

export function createBill(input: {
  name: string
  amount: number
  dueDay: number
  autopay?: boolean
}): Bill {
  const bill: Bill = {
    id: `b${nextBillId++}`,
    name: input.name,
    amount: input.amount,
    dueDay: input.dueDay,
    paid: false,
    autopay: input.autopay ?? false,
  }
  bills.push(bill)
  return bill
}

export function updateBill(
  id: string,
  patch: { paid?: boolean; autopay?: boolean },
): Bill | undefined {
  const bill = findBill(id)
  if (!bill) return undefined
  if (typeof patch.paid === 'boolean') bill.paid = patch.paid
  if (typeof patch.autopay === 'boolean') bill.autopay = patch.autopay
  return bill
}
