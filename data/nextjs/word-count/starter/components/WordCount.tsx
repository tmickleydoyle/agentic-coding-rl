'use client'
import { useState } from 'react'

export default function WordCount() {
  // TODO: controlled textarea; count whitespace-separated words; empty/whitespace -> 0.
  return (
    <div>
      <textarea data-testid="text" />
      <span data-testid="count">0</span>
    </div>
  )
}
