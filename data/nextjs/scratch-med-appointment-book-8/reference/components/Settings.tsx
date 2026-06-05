'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <p>{`Theme: ${theme}`}</p>
      <button onClick={toggleTheme}>Toggle theme</button>
    </section>
  )
}
