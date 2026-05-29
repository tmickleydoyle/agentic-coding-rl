'use client'
import { useState } from 'react'

export default function Checkout() {
  // TODO: 3-page checkout (cart -> shipping -> confirmation -> done). Preserve total +
  // address across Back. Disabled-state rules per description.md.
  return (
    <div>
      <h1 data-testid="page-title">Cart</h1>
      <span data-testid="total">$0</span>
      <button data-testid="add">Add $5</button>
      <button data-testid="next" disabled>Continue</button>
    </div>
  )
}
