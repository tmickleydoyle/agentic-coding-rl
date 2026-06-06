'use client'
import { useState } from 'react'

interface ModalDialogProps {
  title: string
  body: string
}

export default function ModalDialog({ title, body }: ModalDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button data-testid="open-modal" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      {isOpen && (
        <div
          data-testid="modal-overlay"
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }}
        >
          <div
            data-testid="modal-dialog"
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', margin: '10% auto', padding: 24, maxWidth: 400 }}
          >
            <h2 data-testid="modal-title">{title}</h2>
            <p data-testid="modal-body">{body}</p>
            <button data-testid="close-modal" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
