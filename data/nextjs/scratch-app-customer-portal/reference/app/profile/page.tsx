'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export function ProfilePage() {
  const { triggerRefresh } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then((p: { name: string; email: string; phone: string; address: string }) => {
      setName(p.name); setEmail(p.email); setPhone(p.phone); setAddress(p.address)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, address }),
    })
    triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Profile</h1>
      <form data-testid="profile-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
        <input data-testid="input-profile-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input data-testid="input-profile-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input data-testid="input-profile-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
        <input data-testid="input-profile-address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
        <button data-testid="btn-save-profile" type="submit">Save Profile</button>
      </form>
    </div>
  )
}
