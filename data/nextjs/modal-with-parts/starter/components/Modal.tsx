'use client'
import ModalHeader from './ModalHeader'
import ModalBody from './ModalBody'
import ModalFooter from './ModalFooter'

// TODO: return null when !open. When open, render <div data-testid="modal" role="dialog">
// containing ModalHeader, ModalBody, ModalFooter (wire onCancel to onClose).
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
  return null
}
