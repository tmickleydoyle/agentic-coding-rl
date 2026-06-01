'use client'
import { useApp } from '../components/AppStateProvider'
import type { Enrollment } from '../lib/types'

export function countEnrolled(enrollments: Enrollment[], classId: string): number {
  return enrollments.filter((e) => e.classId === classId && e.status === 'enrolled').length
}

export function countWaitlisted(enrollments: Enrollment[], classId: string): number {
  return enrollments.filter((e) => e.classId === classId && e.status === 'waitlisted').length
}

export function useEnrollments() {
  const { enrollments, classes } = useApp()

  const enrolledCount = (classId: string): number => countEnrolled(enrollments, classId)
  const waitlistCount = (classId: string): number => countWaitlisted(enrollments, classId)
  const enrollmentsFor = (classId: string): Enrollment[] =>
    enrollments.filter((e) => e.classId === classId)
  const isFull = (classId: string): boolean => {
    const klass = classes.find((c) => c.id === classId)
    if (!klass) return false
    return enrolledCount(classId) >= klass.capacity
  }

  return { enrolledCount, waitlistCount, enrollmentsFor, isFull }
}
