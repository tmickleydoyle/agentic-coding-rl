'use client'
import { useContext } from 'react'
import { AppContext } from '../components/FeedbackProvider'

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within FeedbackProvider')
  return ctx
}
