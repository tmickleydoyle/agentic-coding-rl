'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Contact, Supplier } from '../../lib/types'

export function ContactsPage() {
  const { triggerRefresh } = useApp()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [role, setRole] = useState('')

  function load() {
    fetch('/api/contacts').then(r => r.json()).then(setContacts)
    fetch('/api/suppliers').then(r => r.json()).then(setSuppliers)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, supplierId, role }),
    })
    setName(''); setEmail(''); setPhone(''); setSupplierId(''); setRole('')
    load(); triggerRefresh()
  }

  function supplierName(id: string) { return suppliers.find(s => s.id === id)?.name ?? id }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Contacts</h1>
      <form data-testid="add-contact-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-contact-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input data-testid="input-contact-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input data-testid="input-contact-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" required />
        <select data-testid="select-contact-supplier" value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
          <option value="">Select supplier</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input data-testid="input-contact-role" value={role} onChange={e => setRole(e.target.value)} placeholder="Role" required />
        <button data-testid="btn-add-contact" type="submit">Add Contact</button>
      </form>
      <ul data-testid="contact-list" style={{ listStyle: 'none', padding: 0 }}>
        {contacts.map(c => (
          <li key={c.id} data-testid="contact-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="contact-name" style={{ fontWeight: 'bold' }}>{c.name}</span>
            {' | '}
            <span data-testid="contact-email">{c.email}</span>
            {' | '}
            <span data-testid="contact-supplier">{supplierName(c.supplierId)}</span>
            {' | '}
            <span data-testid="contact-role">{c.role}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
