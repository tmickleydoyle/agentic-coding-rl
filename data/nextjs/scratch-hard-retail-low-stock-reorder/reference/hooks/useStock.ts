'use client'
import { useContext } from 'react'
import { StockContext } from '../components/StockProvider'

export function useStock() {
  const ctx = useContext(StockContext)
  if (!ctx) throw new Error('useStock must be used within a provider')
  return ctx
}
