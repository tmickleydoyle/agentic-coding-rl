'use client'
import { useState } from 'react'

export default function DarkModeToggle() {
  return (
    <div data-testid="container" data-theme="light">
      <span data-testid="mode-label">Current: Light</span>
      <button data-testid="toggle-btn">Light Mode</button>
    </div>
  )
}
