'use client'
import { useState } from 'react'

function getStrength(password: string): string {
  if (password.length === 0) return ''
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score === 0) return ''
  if (score === 1) return 'Weak'
  if (score === 2) return 'Fair'
  if (score === 3) return 'Good'
  return 'Strong'
}

export default function PasswordStrength() {
  const [password, setPassword] = useState('')

  return (
    <div>
      <input
        data-testid="password-input"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <span data-testid="strength-label">{getStrength(password)}</span>
    </div>
  )
}
