'use client'
import { useState } from 'react'

export default function Wizard() {
  // TODO: 3-step flow with shared name+email; next disabled when current input empty,
  // back disabled on step 1. After Submit on step 3, show only data-testid="status">Done.
  return (
    <div>
      <span data-testid="step">1</span>
      <input data-testid="name" />
      <button data-testid="next">Next</button>
      <button data-testid="back" disabled>Back</button>
    </div>
  )
}
