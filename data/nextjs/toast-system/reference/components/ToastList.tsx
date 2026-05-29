'use client'
import { useToastContext } from './ToastContext'

export default function ToastList() {
  const { toasts, dismiss } = useToastContext()
  return (
    <ul data-testid="toasts">
      {toasts.map((t) => (
        <li key={t.id} data-testid={`toast-${t.id}`}>
          {t.text}
          <button data-testid={`dismiss-${t.id}`} onClick={() => dismiss(t.id)}>
            Dismiss
          </button>
        </li>
      ))}
    </ul>
  )
}
