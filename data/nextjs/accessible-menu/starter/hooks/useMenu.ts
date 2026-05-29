import { useState } from 'react'

// TODO: return { open, highlight, toggle, close, moveDown, moveUp }. open starts false,
// highlight starts 0. toggle flips open and resets highlight to 0 when opening. close sets
// open false. moveDown/moveUp move the highlight with wraparound over itemCount.
export function useMenu(itemCount: number) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  return {
    open,
    highlight,
    toggle: () => {},
    close: () => {},
    moveDown: () => {},
    moveUp: () => {},
  }
}
