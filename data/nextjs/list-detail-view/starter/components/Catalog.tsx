'use client'
import { useState } from 'react'

type Item = { id: string; title: string; body: string }

export default function Catalog({ items }: { items: Item[] }) {
  // TODO: track selected id (null = list view); render list OR detail (mutually exclusive).
  return (
    <ul data-testid="list">
      {items.map((it) => (
        <li key={it.id}>
          <button data-testid={`row-${it.id}`}>{it.title}</button>
        </li>
      ))}
    </ul>
  )
}
