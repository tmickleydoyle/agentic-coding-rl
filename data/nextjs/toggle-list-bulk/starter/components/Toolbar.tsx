'use client'

// TODO: render <span data-testid="count">{selectedCount} selected</span>,
// <button data-testid="select-all">Select all</button> (onSelectAll),
// <button data-testid="clear">Clear</button> (onClear), and
// <button data-testid="delete">Delete selected</button> (onDelete, disabled when selectedCount===0).
export default function Toolbar({
  selectedCount,
  onSelectAll,
  onClear,
  onDelete,
}: {
  selectedCount: number
  onSelectAll: () => void
  onClear: () => void
  onDelete: () => void
}) {
  return (
    <div>
      <span data-testid="count">{selectedCount} selected</span>
    </div>
  )
}
