'use client'
import { useState } from 'react'

function CellInput({
  value,
  onCommit,
  onCancel,
}: {
  value: string
  onCommit: (value: string) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(value)
  return (
    <input
      data-testid="cell-input"
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit(draft)
        else if (e.key === 'Escape') onCancel()
      }}
    />
  )
}

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
  if (!editing) {
    return (
      <span data-testid="cell-text" onDoubleClick={onStartEdit}>
        {value}
      </span>
    )
  }
  return <CellInput value={value} onCommit={onCommit} onCancel={onCancel} />
}
