'use client'
import { useContext } from 'react'
import { GrowthContext } from '../components/GrowthProvider'

export function useGrowth() {
  const ctx = useContext(GrowthContext)
  if (!ctx) throw new Error('useGrowth must be used within GrowthProvider')
  return ctx
}
