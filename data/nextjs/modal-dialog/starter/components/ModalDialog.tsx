'use client'
import { useState } from 'react'

interface ModalDialogProps {
  title: string
  body: string
}

export default function ModalDialog({ title: _title, body: _body }: ModalDialogProps) {
  const [_isOpen] = useState(false)

  return (
    <div>
      <button data-testid="open-modal">
        Open Modal
      </button>
    </div>
  )
}
