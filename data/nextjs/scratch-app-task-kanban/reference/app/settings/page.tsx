'use client'
import { useState } from 'react'
import { useBoard } from '../../components/BoardProvider'

export default function SettingsPage() {
  const { theme, setTheme, wipLimit, setWipLimit } = useBoard()
  const [draft, setDraft] = useState(String(wipLimit))

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

      <span data-testid="current-wip">{wipLimit}</span>
      <input
        type="number"
        data-testid="wip-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button
        data-testid="wip-save"
        onClick={() => {
          const n = Number(draft)
          if (Number.isFinite(n)) setWipLimit(n)
        }}
      >
        Save limit
      </button>
    </section>
  )
}
