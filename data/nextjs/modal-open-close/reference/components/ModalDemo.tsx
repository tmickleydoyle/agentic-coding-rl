'use client'
import { useState } from 'react'

export default function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button data-testid="open" onClick={() => setOpen(true)}>
        Open
      </button>
      {open && (
        <div data-testid="modal">
          This is a modal
          <button data-testid="close" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  )
}
