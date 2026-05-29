'use client'
import { useState } from 'react'

export default function ClearableInput() {
  // TODO: controlled input + Clear button disabled when empty.
  return (
    <div>
      <input data-testid="input" />
      <button data-testid="clear">Clear</button>
    </div>
  )
}
