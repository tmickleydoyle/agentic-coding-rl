'use client'
import ModalHeader from './ModalHeader'
import ModalBody from './ModalBody'
import ModalFooter from './ModalFooter'

export default function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
}: {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  onConfirm: () => void
}) {
  if (!open) return null
  return (
    <div data-testid="modal" role="dialog">
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>{children}</ModalBody>
      <ModalFooter onConfirm={onConfirm} onCancel={onClose} />
    </div>
  )
}
