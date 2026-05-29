'use client'
import { useState } from 'react'

type Page = 'home' | 'about' | 'contact'
const CONTENT: Record<Page, string> = {
  home: 'Welcome',
  about: 'About us',
  contact: 'Get in touch',
}
const LABEL: Record<Page, string> = { home: 'Home', about: 'About', contact: 'Contact' }

export default function App() {
  const [page, setPage] = useState<Page>('home')
  return (
    <div>
      <nav>
        {(['home', 'about', 'contact'] as Page[]).map((p) => (
          <button
            key={p}
            data-testid={`nav-${p}`}
            aria-current={page === p ? 'page' : undefined}
            onClick={() => setPage(p)}
          >
            {LABEL[p]}
          </button>
        ))}
      </nav>
      <main data-testid="page">{CONTENT[page]}</main>
      <span data-testid="current">{page}</span>
    </div>
  )
}
