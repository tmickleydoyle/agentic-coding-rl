'use client'
import type { Course } from '../lib/types'

export default function CourseRow({
  course,
  lessonCount,
  percent,
  onOpen,
}: {
  course: Course
  lessonCount: number
  percent: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`course-${course.id}`}>
      <span data-testid={`course-${course.id}-title`}>{course.title}</span>
      <span data-testid={`course-${course.id}-lesson-count`}>{lessonCount}</span>
      <span data-testid={`course-${course.id}-percent`}>{percent}</span>
      <button data-testid={`open-${course.id}`} onClick={() => onOpen(course.id)}>
        Open
      </button>
    </li>
  )
}
