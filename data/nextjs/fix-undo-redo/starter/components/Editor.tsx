'use client'
import { useUndoable } from '../hooks/useUndoable'

export default function Editor() {
  const { value, set, undo, redo, canUndo, canRedo } = useUndoable<string>('')

  return (
    <div>
      <input
        data-testid="input"
        value={value}
        onChange={(e) => set(e.target.value)}
      />
      <span data-testid="value">{value}</span>
      <button data-testid="undo" onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button data-testid="redo" onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  )
}
