'use client'

// TODO: when not editing, render <span data-testid="cell-text">{value}</span> and call
// onStartEdit() on double-click. When editing, render <input data-testid="cell-input"> seeded
// with `value`; Enter calls onCommit(currentInputValue); Escape calls onCancel(). Editing the
// input is local until Enter.
export default function Cell({
  value,
  editing,
  onStartEdit,
  onCommit,
  onCancel,
}: {
  value: string
  editing: boolean
  onStartEdit: () => void
  onCommit: (value: string) => void
  onCancel: () => void
}) {
  return <span data-testid="cell-text">{value}</span>
}
