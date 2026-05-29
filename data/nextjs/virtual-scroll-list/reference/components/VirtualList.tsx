'use client'
import { useVirtual } from '../hooks/useVirtual'
import RowView from './RowView'

export default function VirtualList({
  items,
  rowHeight,
  viewportHeight,
}: {
  items: string[]
  rowHeight: number
  viewportHeight: number
}) {
  const { onScroll, totalHeight, rows } = useVirtual(items, rowHeight, viewportHeight)

  return (
    <div
      data-testid="viewport"
      onScroll={onScroll}
      style={{ height: viewportHeight, overflowY: 'auto', position: 'relative' }}
    >
      <div data-testid="spacer" style={{ height: totalHeight, position: 'relative' }}>
        {rows.map((row) => (
          <RowView key={row.index} index={row.index} top={row.top} height={rowHeight}>
            {row.item}
          </RowView>
        ))}
      </div>
    </div>
  )
}
