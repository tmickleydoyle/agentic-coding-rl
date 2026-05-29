'use client'
import { useState } from 'react'

export default function SearchFilter({ items }: { items: string[] }) {
  // TODO: controlled input; case-insensitive substring filter; render <ul data-testid="results">.
  // If no matches: render data-testid="no-results" with text "No matches".
  return (
    <div>
      <input data-testid="query" />
      <ul data-testid="results"></ul>
    </div>
  )
}
