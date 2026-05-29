'use client'
import { useState } from 'react'

export default function App() {
  // TODO: two-view login flow. Show error only after a failed login attempt. Logout
  // clears fields. Mutually exclusive: login page or dashboard.
  return (
    <div>
      <input data-testid="username" />
      <input data-testid="password" />
      <button data-testid="login">Login</button>
    </div>
  )
}
