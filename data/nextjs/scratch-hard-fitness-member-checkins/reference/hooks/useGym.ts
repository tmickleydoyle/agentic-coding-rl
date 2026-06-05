'use client'
import { useContext } from 'react'
import { GymContext } from '../components/GymProvider'

export function useGym() {
  const ctx = useContext(GymContext)
  if (!ctx) throw new Error('useGym must be used within GymProvider')
  return ctx
}
