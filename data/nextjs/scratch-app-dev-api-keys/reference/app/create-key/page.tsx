'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import type { Scope } from '../../lib/types'

export default function CreateKeyPage() {
  const { createKey, navigate } = useApp()
  const [name, setName] = useState('')
  const [read, setRead] = useState(true)
  const [write, setWrite] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    const scopes: Scope[] = []
    if (read) scopes.push('read')
    if (write) scopes.push('write')
    if (admin) scopes.push('admin')
    createKey({ name: name.trim(), scopes })
    setName('')
    navigate('keys')
  }

  return (
    <section data-testid="page-create-key">
      <h1>Create key</h1>
      <form data-testid="create-key-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            data-testid="scope-read"
            checked={read}
            onChange={(e) => setRead(e.target.checked)}
          />
          read
        </label>
        <label>
          <input
            type="checkbox"
            data-testid="scope-write"
            checked={write}
            onChange={(e) => setWrite(e.target.checked)}
          />
          write
        </label>
        <label>
          <input
            type="checkbox"
            data-testid="scope-admin"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
          />
          admin
        </label>

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-key">
          Create
        </button>
      </form>
    </section>
  )
}
