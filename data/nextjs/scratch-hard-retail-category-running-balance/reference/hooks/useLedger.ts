'use client'
import { useContext } from 'react'
import { LedgerContext } from '../components/LedgerProvider'

export function useLedger() {
  const ctx = useContext(LedgerContext)
  if (!ctx) throw new Error('useLedger must be used within a provider')
  return ctx
}
