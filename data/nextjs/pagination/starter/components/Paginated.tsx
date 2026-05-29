'use client'
import { useState } from 'react'

export default function Paginated({ items }: { items: string[] }) {
  // TODO: track current page (1-indexed); page size = 5; clamped Prev/Next; indicator
  // text "Page <n> of <total>"; disabled state on Prev/Next at the bounds.
  return (
    <div>
      <ul data-testid="page"></ul>
      <button data-testid="prev">Prev</button>
      <button data-testid="next">Next</button>
      <span data-testid="indicator">Page 1 of 1</span>
    </div>
  )
}
