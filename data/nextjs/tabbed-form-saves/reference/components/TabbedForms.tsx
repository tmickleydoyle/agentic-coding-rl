'use client'
import { useState } from 'react'

type Tab = 'general' | 'contact' | 'bio'

export default function TabbedForms() {
  const [tab, setTab] = useState<Tab>('general')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [statusGeneral, setStatusGeneral] = useState('')
  const [statusContact, setStatusContact] = useState('')
  const [statusBio, setStatusBio] = useState('')

  const navBtn = (t: Tab, label: string) => (
    <button
      data-testid={`tab-${t}`}
      aria-current={tab === t ? 'page' : undefined}
      onClick={() => setTab(t)}
    >
      {label}
    </button>
  )

  return (
    <div>
      <nav>
        {navBtn('general', 'General')}
        {navBtn('contact', 'Contact')}
        {navBtn('bio', 'Bio')}
      </nav>
      <section>
        {tab === 'general' && (
          <>
            <input
              data-testid="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button data-testid="save-general" onClick={() => setStatusGeneral(`Saved: ${name}`)}>
              Save
            </button>
            <span data-testid="status-general">{statusGeneral}</span>
          </>
        )}
        {tab === 'contact' && (
          <>
            <input
              data-testid="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button data-testid="save-contact" onClick={() => setStatusContact(`Saved: ${email}`)}>
              Save
            </button>
            <span data-testid="status-contact">{statusContact}</span>
          </>
        )}
        {tab === 'bio' && (
          <>
            <textarea
              data-testid="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <button data-testid="save-bio" onClick={() => setStatusBio(`Saved: ${bio}`)}>
              Save
            </button>
            <span data-testid="status-bio">{statusBio}</span>
          </>
        )}
      </section>
    </div>
  )
}
