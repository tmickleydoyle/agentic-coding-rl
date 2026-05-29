'use client'
import { createContext, useContext } from 'react'
import type { Toast } from '../hooks/useToast'

export type ToastApi = {
  toasts: Toast[]
  show: (text: string) => void
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToastContext(): ToastApi {
  const v = useContext(ToastContext)
  if (!v) throw new Error('ToastContext not provided')
  return v
}
