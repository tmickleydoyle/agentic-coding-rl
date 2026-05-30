'use client'
import type { Lesson } from '../lib/types'

export default function LessonRow(_props: {
  courseId: string
  lesson: Lesson
  complete: boolean
  onPlay: (courseId: string, lessonId: string) => void
}) {
  // TODO: render the lesson-<courseId>-<lessonId> row with title and play button.
  return null
}
