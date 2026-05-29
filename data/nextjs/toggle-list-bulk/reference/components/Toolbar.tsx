'use client'

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
      <button data-testid="select-all" onClick={onSelectAll}>
        Select all
      </button>
      <button data-testid="clear" onClick={onClear}>
        Clear
      </button>
      <button data-testid="delete" disabled={selectedCount === 0} onClick={onDelete}>
        Delete selected
      </button>
    </div>
  )
}
