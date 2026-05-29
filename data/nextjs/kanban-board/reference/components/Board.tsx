'use client'
import { useState } from 'react'
import type { Card, ColumnIndex } from './types'
import { COLUMN_NAMES } from './types'
import Column from './Column'

export default function Board({ initialCards }: { initialCards: Card[] }) {
  const [columns, setColumns] = useState<Record<number, ColumnIndex>>(() => {
    const init: Record<number, ColumnIndex> = {}
    for (const c of initialCards) init[c.id] = 0
    return init
  })

  const onMove = (id: number, dir: -1 | 1) => {
    setColumns((prev) => {
      const current = prev[id]
      const next = Math.min(2, Math.max(0, current + dir)) as ColumnIndex
      return { ...prev, [id]: next }
    })
  }

  return (
    <div>
      {COLUMN_NAMES.map((name, i) => {
        const index = i as ColumnIndex
        const cards = initialCards.filter((c) => columns[c.id] === index)
        return (
          <Column key={index} name={name} index={index} cards={cards} onMove={onMove} />
        )
      })}
    </div>
  )
}
