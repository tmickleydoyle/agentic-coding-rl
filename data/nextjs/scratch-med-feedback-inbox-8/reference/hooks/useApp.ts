'use client'
import { useContext } from 'react'
import { FeedbackContext } from '../components/FeedbackProvider'

export function useApp() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useApp must be used within FeedbackProvider')
  return ctx
}
