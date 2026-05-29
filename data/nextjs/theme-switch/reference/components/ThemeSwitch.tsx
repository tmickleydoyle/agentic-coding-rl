'use client'
import { useState } from 'react'

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <div data-testid="root" data-theme={theme}>
      <button data-testid="toggle" onClick={() => setTheme(next)}>
        Switch to {next}
      </button>
    </div>
  )
}
