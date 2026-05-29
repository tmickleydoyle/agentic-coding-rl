import { useState, type UIEvent } from 'react'
import type { Row } from '../components/types'

// TODO: return { scrollTop, onScroll, totalHeight, rows }.
// onScroll(e) sets scrollTop = e.currentTarget.scrollTop. totalHeight = items.length * rowHeight.
// first = floor(scrollTop / rowHeight); visibleCount = ceil(viewportHeight / rowHeight).
// start = max(0, first - OVERSCAN); end = min(items.length-1, first + visibleCount - 1 + OVERSCAN).
// rows = one { index, item, top: index*rowHeight } per index start..end (inclusive); [] if empty.
export function useVirtual<T>(items: T[], rowHeight: number, viewportHeight: number) {
  const [scrollTop, setScrollTop] = useState(0)
  const onScroll = (_e: UIEvent<HTMLDivElement>) => {}
  return { scrollTop, onScroll, totalHeight: 0, rows: [] as Row<T>[] }
}
