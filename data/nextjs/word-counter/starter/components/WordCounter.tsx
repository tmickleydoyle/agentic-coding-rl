'use client'
import { useState } from 'react'

export default function WordCounter() {
  return (
    <div>
      <textarea data-testid="textarea" />
      <span data-testid="word-count">0</span>
      <button data-testid="clear-btn">Clear</button>
    </div>
  )
}
