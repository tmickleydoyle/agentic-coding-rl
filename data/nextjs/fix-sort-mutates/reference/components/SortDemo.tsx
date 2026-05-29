'use client'
import { useState } from 'react'
import SortedList from './SortedList'

export default function SortDemo() {
  const [original] = useState<number[]>([3, 1, 2])

  return (
    <div>
      <span data-testid="original">{original.join(', ')}</span>
      <SortedList rows={original} />
    </div>
  )
}
