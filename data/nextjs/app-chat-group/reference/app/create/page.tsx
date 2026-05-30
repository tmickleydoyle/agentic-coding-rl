'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import type { Theme } from '../../lib/types'

export default function CreatePage() {
  const { theme, setTheme, createGroup } = useApp()
  const [name, setName] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) return
    createGroup(name)
    setName('')
  }

  return (
    <section data-testid="page-create">
      <h1>Create group</h1>
      <form data-testid="create-form" onSubmit={onSubmit}>
        <input data-testid="name-input" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" data-testid="create-submit">
          Create
        </button>
      </form>
      <label htmlFor="theme-select">Theme</label>
      <select
        id="theme-select"
        data-testid="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </section>
  )
}
