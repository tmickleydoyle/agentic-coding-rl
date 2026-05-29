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
  // BUG: flooring the window bottom and treating the range as exclusive of this
  // index drops the final partially-visible row.
  const endIndex = Math.min(
    total - 1,
    Math.floor((scrollTop + viewportHeight) / rowHeight)
  )

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  const visible: { index: number; text: string }[] = []
  for (let i = startIndex; i < endIndex; i++) {
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
