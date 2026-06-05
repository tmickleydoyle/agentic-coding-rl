'use client'
import { useContext } from 'react'
import { PlatformContext } from '../components/PlatformProvider'

export function usePlatform() {
  const ctx = useContext(PlatformContext)
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider')
  return ctx
}
