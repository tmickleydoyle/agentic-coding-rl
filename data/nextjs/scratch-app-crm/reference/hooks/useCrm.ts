'use client'
import { useContext } from 'react'
import { CrmContext } from '../components/CrmProvider'

export function useCrm() {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm must be used within CrmProvider')
  return ctx
}
