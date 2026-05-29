'use client'
import { useState } from 'react'

export default function TwoStepForm() {
  // TODO: 2-step flow with shared name state, Back preserves name, Submit disabled
  // when email empty. After submit show only data-testid="status".
  return (
    <div>
      <span data-testid="step">1</span>
      <input data-testid="name" />
      <button data-testid="next">Next</button>
    </div>
  )
}
