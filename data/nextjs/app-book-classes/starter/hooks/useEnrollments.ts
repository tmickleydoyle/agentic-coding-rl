'use client'
import { useApp } from '../components/AppStateProvider'
import type { Enrollment } from '../lib/types'

export function useEnrollments() {
  // TODO: derive enrolledCount/waitlistCount/enrollmentsFor/isFull from shared state.
  useApp()
  const enrolledCount = (_classId: string): number => 0
  const waitlistCount = (_classId: string): number => 0
  const enrollmentsFor = (_classId: string): Enrollment[] => []
  const isFull = (_classId: string): boolean => false
  return { enrolledCount, waitlistCount, enrollmentsFor, isFull }
}
