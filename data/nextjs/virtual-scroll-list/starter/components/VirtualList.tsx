'use client'
import { useVirtual } from '../hooks/useVirtual'
import RowView from './RowView'

// TODO: outer <div data-testid="viewport"> (style { height: viewportHeight, overflowY: 'auto',
// position: 'relative' }, onScroll wired to the hook) wrapping an inner spacer
// <div data-testid="spacer"> (style { height: totalHeight, position: 'relative' }) that contains
// one <RowView> per windowed row (key by index) rendering the string item as its child.
export default function VirtualList({
  items,
  rowHeight,
  viewportHeight,
}: {
  items: string[]
  rowHeight: number
  viewportHeight: number
}) {
  const { rows } = useVirtual(items, rowHeight, viewportHeight)
  return <div data-testid="viewport" />
}
