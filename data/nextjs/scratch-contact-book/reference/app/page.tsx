'use client'
import { useState } from 'react'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
}

const SEED: Contact[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', phone: '555-0103' },
  { id: 4, name: 'David Brown', email: 'david@example.com', phone: '555-0104' },
]

let nextId = SEED.length + 1

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(SEED.map(x => ({ ...x })))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [search, setSearch] = useState('')

  function add() {
    if (!name.trim() || !email.trim()) return
    const newContact: Contact = { id: nextId++, name: name.trim(), email: email.trim(), phone: phone.trim() }
    setContacts(xs => [...xs, newContact].sort((a, b) => a.name.localeCompare(b.name)))
    setName('')
    setEmail('')
    setPhone('')
  }

  function remove(id: number) {
    setContacts(xs => xs.filter(x => x.id !== id))
  }

  const q = search.toLowerCase()
  const visible = contacts.filter(c =>
    c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  )

  return (
    <div>
      <h1>Contact Book</h1>

      <div>
        <input aria-label="Name" value={name} onChange={e => setName(e.target.value)} />
        <input aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input aria-label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <button onClick={add}>Add Contact</button>
      </div>

      <div>
        <input
          aria-label="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email"
        />
      </div>

      <p data-testid="count">{visible.length} contacts</p>

      <ul>
        {visible.map(c => (
          <li key={c.id} data-testid="contact-row">
            <span>{c.name}</span> — <span>{c.email}</span> — <span>{c.phone}</span>
            <button onClick={() => remove(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
