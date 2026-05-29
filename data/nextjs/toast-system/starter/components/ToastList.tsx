'use client'
import { useToastContext } from './ToastContext'

// TODO: render <ul data-testid="toasts"> with <li data-testid="toast-<id>"> per toast,
// each with a Dismiss button data-testid="dismiss-<id>".
export default function ToastList() {
  const { toasts, dismiss } = useToastContext()
  return <ul data-testid="toasts"></ul>
}
