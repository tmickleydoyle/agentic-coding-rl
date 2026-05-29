import { useState } from 'react'

export function useMenu(itemCount: number) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const toggle = () => {
    setOpen((o) => {
      if (!o) setHighlight(0)
      return !o
    })
  }
  const close = () => setOpen(false)
  const moveDown = () => setHighlight((h) => (h + 1) % itemCount)
  const moveUp = () => setHighlight((h) => (h - 1 + itemCount) % itemCount)

  return { open, highlight, toggle, close, moveDown, moveUp }
}
