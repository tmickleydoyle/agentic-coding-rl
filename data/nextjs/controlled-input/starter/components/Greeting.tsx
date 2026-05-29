'use client'
import { useState } from 'react'

export default function Greeting() {
  // TODO: make this a controlled input. The greeting must update as the user types,
  // and fall back to "Hello, stranger!" when the input is empty.
  return (
    <div>
      <label>
        Your name
        <input type="text" />
      </label>
      <p data-testid="greeting">Hello, stranger!</p>
    </div>
  )
}
