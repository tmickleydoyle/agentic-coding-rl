'use client'
import { useState } from 'react'

type Props = { rows: number[] }

export default function SortedList({ rows }: Props) {
  const [display, setDisplay] = useState<number[]>(rows)

  const onSort = () => {
    const sorted = rows.sort((a, b) => a - b)
    setDisplay(sorted)
  }

  return (
    <div>
      <button data-testid="sort" onClick={onSort}>
        Sort
      </button>
      <span data-testid="sorted">{display.join(', ')}</span>
    </div>
  )
}
