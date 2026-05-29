'use client'
import type { ReactNode } from 'react'

// TODO: render <div data-testid={`row-${index}`}> with inline style
// { position: 'absolute', top, height }, containing children.
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
  return <div data-testid={`row-${index}`}>{children}</div>
}
