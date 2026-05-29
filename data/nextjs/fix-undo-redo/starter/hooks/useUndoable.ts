'use client'
import { useState, useCallback } from 'react'

export interface Undoable<T> {
  value: T
  set: (next: T) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function useUndoable<T>(initial: T): Undoable<T> {
  const [stack, setStack] = useState<T[]>([initial])
  const [pointer, setPointer] = useState(0)

  const set = useCallback((next: T) => {
    setStack((s) => {
      // BUG: appends to the full stack without truncating the redo future, so
      // states after the current pointer survive and can be "redone" later.
      return [...s, next]
    })
    setPointer((p) => p + 1)
  }, [])

  const undo = useCallback(() => {
    // BUG: does not stop at 0, so the pointer can go negative and value becomes
    // undefined at the lower boundary.
    setPointer((p) => p - 1)
  }, [])

  const redo = useCallback(() => {
    setPointer((p) => p + 1)
  }, [])

  return {
    value: stack[pointer],
    set,
    undo,
    redo,
    canUndo: pointer > 0,
    canRedo: pointer < stack.length - 1,
  }
}
