'use client'
export default function ModalFooter({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div data-testid="modal-footer">
      <button data-testid="modal-confirm" onClick={onConfirm}>OK</button>
      <button data-testid="modal-cancel" onClick={onCancel}>Cancel</button>
    </div>
  )
}
