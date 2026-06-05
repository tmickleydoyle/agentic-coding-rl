'use client'
import { useContext } from 'react'
import { FunnelContext } from '../components/FunnelProvider'

export function useFunnel() {
  const ctx = useContext(FunnelContext)
  if (!ctx) throw new Error('useFunnel must be used within FunnelProvider')
  return ctx
}
