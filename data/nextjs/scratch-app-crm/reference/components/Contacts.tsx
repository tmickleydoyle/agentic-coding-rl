'use client'
import { useState } from 'react'
import { useCrm } from '../hooks/useCrm'

export function Contacts() {
  const { contacts, addContact } = useCrm()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [amount, setAmount] = useState('')
  return (
    <section aria-label="Contacts view">
      <h1>Contacts</h1>
      <input aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
      <input
        aria-label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={() => {
          addContact(name, company, amount)
          setName('')
          setCompany('')
          setAmount('')
        }}
      >
        Add contact
      </button>
      <ul>
        {contacts.map((c) => (
          <li key={c.id}>{`${c.name} — ${c.company} ($${c.amount})`}</li>
        ))}
      </ul>
    </section>
  )
}
