'use client'
import { useState, FormEvent } from 'react'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [status, setStatus] = useState<'' | 'errors' | 'ok'>('')

  const validate = () => {
    const next: typeof errors = {}
    if (!email.includes('@') || !email.includes('.')) {
      next.email = 'Email must contain @ and .'
    }
    if (password.length < 8) {
      next.password = 'Password must be at least 8 characters.'
    }
    return next
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    setStatus(Object.keys(next).length === 0 ? 'ok' : 'errors')
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        data-testid="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <p data-testid="email-error">{errors.email}</p>}
      <input
        data-testid="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <p data-testid="password-error">{errors.password}</p>}
      <button data-testid="submit" type="submit">
        Sign up
      </button>
      <p data-testid="status">
        {status === 'errors' ? 'Please fix the errors above.' : status === 'ok' ? 'Submitted!' : ''}
      </p>
    </form>
  )
}
