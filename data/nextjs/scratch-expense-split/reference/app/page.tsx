'use client'
import { useState } from 'react'

type Expense = {
  id: number
  desc: string
  amount: number
  payer: string
  participants: string[]
}

function signed(n: number) {
  const v = Math.abs(n).toFixed(2)
  return n < -0.005 ? `-$${v}` : `+$${v}`
}

export default function App() {
  const [people, setPeople] = useState<string[]>([])
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [payer, setPayer] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [nextId, setNextId] = useState(1)

  function addPerson() {
    const n = name.trim()
    if (!n || people.includes(n)) return
    setPeople((p) => [...p, n])
    if (!payer) setPayer(n)
    setName('')
  }

  function addExpense() {
    const a = parseFloat(amount)
    const d = desc.trim()
    if (!d || !payer || !isFinite(a) || a <= 0 || people.length === 0) return
    setExpenses((e) => [
      ...e,
      { id: nextId, desc: d, amount: a, payer, participants: [...people] },
    ])
    setNextId((i) => i + 1)
    setDesc('')
    setAmount('')
  }

  const balances: Record<string, number> = {}
  people.forEach((p) => {
    balances[p] = 0
  })
  expenses.forEach((e) => {
    balances[e.payer] = (balances[e.payer] ?? 0) + e.amount
    const share = e.amount / e.participants.length
    e.participants.forEach((p) => {
      balances[p] = (balances[p] ?? 0) - share
    })
  })

  // Greedy settlement: largest creditor receives from largest debtor until even.
  const creditors = people
    .map((p) => ({ p, bal: balances[p] }))
    .filter((x) => x.bal > 0.005)
    .sort((a, b) => b.bal - a.bal)
  const debtors = people
    .map((p) => ({ p, bal: balances[p] }))
    .filter((x) => x.bal < -0.005)
    .sort((a, b) => a.bal - b.bal)
  const settlements: string[] = []
  let i = 0
  let j = 0
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(-debtors[i].bal, creditors[j].bal)
    settlements.push(`${debtors[i].p} pays ${creditors[j].p} $${pay.toFixed(2)}`)
    debtors[i].bal += pay
    creditors[j].bal -= pay
    if (Math.abs(debtors[i].bal) < 0.005) i++
    if (Math.abs(creditors[j].bal) < 0.005) j++
  }

  return (
    <div>
      <h1>Expense Splitter</h1>

      <section aria-label="People">
        <h2>People</h2>
        <input aria-label="Person name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={addPerson}>Add person</button>
        <ul>
          {people.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section aria-label="Add expense">
        <h2>Add expense</h2>
        <input aria-label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <input
          aria-label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select aria-label="Paid by" value={payer} onChange={(e) => setPayer(e.target.value)}>
          {people.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button onClick={addExpense}>Add expense</button>
      </section>

      <section aria-label="Balances">
        <h2>Balances</h2>
        <ul>
          {people.map((p) => (
            <li key={p}>
              {p} {signed(balances[p] ?? 0)}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Settlement">
        <h2>Settlement</h2>
        <ul>
          {settlements.length === 0 ? (
            <li>All settled up</li>
          ) : (
            settlements.map((s, k) => <li key={k}>{s}</li>)
          )}
        </ul>
      </section>
    </div>
  )
}
