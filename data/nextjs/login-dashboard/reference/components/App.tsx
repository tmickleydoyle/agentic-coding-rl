'use client'
import { useState } from 'react'

export default function App() {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState(false)

  const tryLogin = () => {
    if (u.trim() === '') {
      setError(true)
      return
    }
    setError(false)
    setLoggedIn(true)
  }

  const logout = () => {
    setLoggedIn(false)
    setU('')
    setP('')
    setError(false)
  }

  if (loggedIn) {
    return (
      <div>
        <h1 data-testid="welcome">Welcome, {u}!</h1>
        <button data-testid="logout" onClick={logout}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      <input data-testid="username" value={u} onChange={(e) => setU(e.target.value)} />
      <input data-testid="password" value={p} onChange={(e) => setP(e.target.value)} />
      <button data-testid="login" onClick={tryLogin}>Login</button>
      {error && <p data-testid="error">Username required</p>}
    </div>
  )
}
