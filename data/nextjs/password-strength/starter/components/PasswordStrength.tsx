'use client'
import { useState } from 'react'

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
      <span data-testid="strength-label"></span>
    </div>
  )
}
