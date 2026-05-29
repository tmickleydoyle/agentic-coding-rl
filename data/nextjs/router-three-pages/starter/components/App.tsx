'use client'
import { useState } from 'react'

export default function App() {
  // TODO: track current page (home/about/contact); render nav buttons + main content;
  // active button has aria-current="page". Page text per description.md.
  return (
    <div>
      <nav>
        <button data-testid="nav-home">Home</button>
        <button data-testid="nav-about">About</button>
        <button data-testid="nav-contact">Contact</button>
      </nav>
      <main data-testid="page">Welcome</main>
      <span data-testid="current">home</span>
    </div>
  )
}
