'use client'
import { useState } from 'react'

export default function CharCount() {
  // TODO: controlled input + live count; warning only when length > 100.
  return (
    <div>
      <input data-testid="input" />
      <span data-testid="count">0</span>
    </div>
  )
}
