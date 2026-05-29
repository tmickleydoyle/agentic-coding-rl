'use client'
import { useState, UIEvent } from 'react'

interface VirtualListProps {
  items: string[]
  rowHeight: number
  viewportHeight: number
}

export default function VirtualList({ items, rowHeight, viewportHeight }: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const total = items.length
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight))
  // ceil of the window bottom gives the first row fully past the window; the last
  // row to render is that minus one, so the partial bottom row is included.
  const endIndex = Math.min(
    total - 1,
    Math.ceil((scrollTop + viewportHeight) / rowHeight) - 1
  )

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  const visible: { index: number; text: string }[] = []
  for (let i = startIndex; i <= endIndex; i++) {
    visible.push({ index: i, text: items[i] })
  }

  return (
    <div
      data-testid="viewport"
      onScroll={onScroll}
      style={{ height: viewportHeight, overflowY: 'auto', position: 'relative' }}
    >
      <div style={{ height: total * rowHeight, position: 'relative' }}>
        {visible.map((row) => (
          <div
            key={row.index}
            data-testid={`row-${row.index}`}
            style={{
              position: 'absolute',
              top: row.index * rowHeight,
              height: rowHeight,
            }}
          >
            {row.text}
          </div>
        ))}
      </div>
    </div>
  )
}
