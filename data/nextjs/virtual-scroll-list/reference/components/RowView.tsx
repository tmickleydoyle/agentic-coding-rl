'use client'
import type { ReactNode } from 'react'

export default function RowView({
  index,
  top,
  height,
  children,
}: {
  index: number
  top: number
  height: number
  children: ReactNode
}) {
  return (
    <div
      data-testid={`row-${index}`}
      style={{ position: 'absolute', top, height }}
    >
      {children}
    </div>
  )
}
