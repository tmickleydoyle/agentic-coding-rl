'use client'
import { useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  return (
    <div data-testid="container" data-theme={dark ? 'dark' : 'light'} className={dark ? 'dark' : ''}>
      <span data-testid="mode-label">Current: {dark ? 'Dark' : 'Light'}</span>
      <button data-testid="toggle-btn" onClick={() => setDark(d => !d)}>
        {dark ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  )
}
