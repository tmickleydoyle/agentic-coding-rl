'use client'
import { useState } from 'react'
import { useCards } from '../../components/CardsProvider'
import type { Card } from '../../lib/types'

function LimitEditor({ card }: { card: Card }) {
  const { setLimit } = useCards()
  const [value, setValue] = useState(String(card.limit))
  return (
    <div data-testid={`limit-${card.id}`}>
      <span data-testid={`limit-${card.id}-label`}>{card.label}</span>
      <input
        data-testid={`limit-${card.id}-input`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        data-testid={`limit-${card.id}-save`}
        onClick={() => {
          const parsed = Number(value)
          if (!Number.isNaN(parsed) && parsed >= 0) setLimit(card.id, parsed)
        }}
      >
        Save
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { theme, setTheme, cards } = useCards()
  return (
    <section data-testid="page-settings">
      <h1>Settings</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      {cards.map((c) => (
        <LimitEditor key={c.id} card={c} />
      ))}
    </section>
  )
}
