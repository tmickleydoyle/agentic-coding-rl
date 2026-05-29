// TODO: implement useToast() returning { toasts, show, dismiss }.
import { useState } from 'react'

export type Toast = { id: number; text: string }

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  return {
    toasts,
    show: (_text: string) => {},
    dismiss: (_id: number) => {},
  }
}
