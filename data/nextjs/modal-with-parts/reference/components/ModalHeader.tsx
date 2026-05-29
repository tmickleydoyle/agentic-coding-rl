'use client'
export default function ModalHeader({
  title,
  onClose,
}: {
  title: string
  onClose: () => void
}) {
  return (
    <div data-testid="modal-header">
      <h2 data-testid="modal-title">{title}</h2>
      <button data-testid="modal-close" onClick={onClose}>Close</button>
    </div>
  )
}
