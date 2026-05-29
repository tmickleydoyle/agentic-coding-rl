'use client'
import { useState } from 'react'

export default function Negate() {
  // TODO: controlled number input; on Negate click compute -value and show in result.
  return (
    <div>
      <input data-testid="input" type="number" />
      <button data-testid="negate">Negate</button>
      <span data-testid="result">0</span>
    </div>
  )
}
