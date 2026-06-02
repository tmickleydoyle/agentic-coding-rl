'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, clearAll, navigate } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <button onClick={() => { clearAll(); navigate('summary') }}>Clear all expenses</button>
    </section>
  )
}
