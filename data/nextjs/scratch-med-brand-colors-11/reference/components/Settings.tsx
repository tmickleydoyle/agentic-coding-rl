'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, clearColors } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <button onClick={clearColors}>Clear all colors</button>
    </section>
  )
}
