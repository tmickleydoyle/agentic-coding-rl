'use client'
import { useTheme } from './ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <button data-testid="toggle" onClick={toggle}>
      Switch to {next}
    </button>
  )
}
