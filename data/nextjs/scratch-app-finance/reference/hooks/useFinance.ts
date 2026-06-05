'use client'
import { useContext } from 'react'
import { FinanceContext } from '../components/FinanceProvider'

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
