import { useState, type UIEvent } from 'react'
import type { Row } from '../components/types'
import { OVERSCAN } from '../components/types'

export function useVirtual<T>(items: T[], rowHeight: number, viewportHeight: number) {
  const [scrollTop, setScrollTop] = useState(0)

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  const totalHeight = items.length * rowHeight

  const rows: Row<T>[] = []
  if (items.length > 0) {
    const first = Math.floor(scrollTop / rowHeight)
    const visibleCount = Math.ceil(viewportHeight / rowHeight)
    const start = Math.max(0, first - OVERSCAN)
    const end = Math.min(items.length - 1, first + visibleCount - 1 + OVERSCAN)
    for (let i = start; i <= end; i++) {
      rows.push({ index: i, item: items[i], top: i * rowHeight })
    }
  }

  return { scrollTop, onScroll, totalHeight, rows }
}
