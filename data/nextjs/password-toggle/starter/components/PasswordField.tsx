'use client'
import { useState } from 'react'

export default function PasswordField() {
  // TODO: track visibility; toggle input type + button label.
  return (
    <div>
      <input data-testid="pw" type="password" />
      <button data-testid="toggle">Show</button>
    </div>
  )
}
