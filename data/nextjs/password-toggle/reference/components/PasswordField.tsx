'use client'
import { useState } from 'react'

export default function PasswordField() {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <input data-testid="pw" type={visible ? 'text' : 'password'} />
      <button data-testid="toggle" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
