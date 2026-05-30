'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function RegisterPage() {
  const { houses, currentHouseId, registerVisitor, navigate } = useApp()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const current = houses.find((h) => h.id === currentHouseId)
  if (!current) {
    return (
      <section data-testid="page-register">
        <p data-testid="no-house">No house selected.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    registerVisitor(current.id, name.trim())
    setName('')
    navigate('house-detail')
  }

  return (
    <section data-testid="page-register">
      <h1>Register visitor</h1>
      <form data-testid="register-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-visitor">
          Register
        </button>
      </form>
    </section>
  )
}
