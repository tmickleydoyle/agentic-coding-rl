'use client'
import { useState } from 'react'

export default function Accordion({ panels }: { panels: { title: string; body: string }[] }) {
  // TODO: track which panel indices are open (set/array); for each panel render a header
  // button with data-testid="header-<i>" and aria-expanded, and render body when open.
  return (
    <div>
      {panels.map((p, i) => (
        <div key={i}>
          <button data-testid={`header-${i}`} aria-expanded="false">
            {p.title}
          </button>
        </div>
      ))}
    </div>
  )
}
