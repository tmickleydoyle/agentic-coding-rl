import { useRef, useState } from 'react'

export type Toast = { id: number; text: string }

export function useToast() {
  const nextId = useRef(1)
  const [toasts, setToasts] = useState<Toast[]>([])
  return {
    toasts,
    show: (text: string) => {
      const id = nextId.current++
      setToasts((prev) => [...prev, { id, text }])
    },
    dismiss: (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)),
  }
}
