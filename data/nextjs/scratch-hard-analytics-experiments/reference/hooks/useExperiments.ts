'use client'
import { useContext } from 'react'
import { ExperimentsContext } from '../components/ExperimentsProvider'

export function useExperiments() {
  const ctx = useContext(ExperimentsContext)
  if (!ctx) throw new Error('useExperiments must be used within ExperimentsProvider')
  return ctx
}
