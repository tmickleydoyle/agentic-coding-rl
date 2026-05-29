'use client'
import { useState } from 'react'

type Page = 'profile' | 'privacy' | 'notifications'

export default function Settings() {
  const [page, setPage] = useState<Page>('profile')
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [emailPref, setEmailPref] = useState(false)

  const navBtn = (p: Page, label: string) => (
    <button
      data-testid={`sub-${p}`}
      aria-current={page === p ? 'page' : undefined}
      onClick={() => setPage(p)}
    >
      {label}
    </button>
  )

  return (
    <div>
      <nav>
        {navBtn('profile', 'Profile')}
        {navBtn('privacy', 'Privacy')}
        {navBtn('notifications', 'Notifications')}
      </nav>
      <section data-testid="section">
        {page === 'profile' && (
          <input
            data-testid="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        {page === 'privacy' && (
          <>
            <button data-testid="public-toggle" onClick={() => setIsPublic((v) => !v)}>
              {isPublic ? 'Make profile private' : 'Make profile public'}
            </button>
            <span data-testid="visibility">{isPublic ? 'public' : 'private'}</span>
          </>
        )}
        {page === 'notifications' && (
          <input
            type="checkbox"
            data-testid="email-pref"
            checked={emailPref}
            onChange={() => setEmailPref((v) => !v)}
          />
        )}
      </section>
    </div>
  )
}
