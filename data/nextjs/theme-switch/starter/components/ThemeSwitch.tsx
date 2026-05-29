'use client'
import { useState } from 'react'

export default function ThemeSwitch() {
  // TODO: track current theme; render <div data-testid="root" data-theme=...> with the
  // toggle button inside. Button label depends on current theme.
  return (
    <div data-testid="root" data-theme="light">
      <button data-testid="toggle">Switch to dark</button>
    </div>
  )
}
