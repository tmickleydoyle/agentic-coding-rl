'use client'
import { useState } from 'react'

export default function FlipCard() {
  return (
    <div data-testid="flip-card">
      <div data-testid="front-face">Front</div>
      <button data-testid="flip-btn">Flip</button>
    </div>
  )
}
