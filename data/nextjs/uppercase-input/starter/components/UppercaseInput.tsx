'use client'
import { useState } from 'react'

export default function UppercaseInput() {
  // TODO: controlled input; data-testid="echo" shows value.toUpperCase().
  return (
    <div>
      <input data-testid="input" />
      <span data-testid="echo"></span>
    </div>
  )
}
