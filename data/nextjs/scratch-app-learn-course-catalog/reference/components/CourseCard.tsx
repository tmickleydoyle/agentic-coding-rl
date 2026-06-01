'use client'
import type { Course } from '../lib/types'

export default function CourseCard({
  course,
  enrolled,
  onOpen,
}: {
  course: Course
  enrolled: boolean
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`course-${course.id}`}>
      <span data-testid={`course-${course.id}-title`}>{course.title}</span>
      <span data-testid={`course-${course.id}-lesson-count`}>{course.lessons.length}</span>
      {enrolled ? (
        <span data-testid={`enrolled-badge-${course.id}`}>Enrolled</span>
      ) : null}
      <button data-testid={`open-${course.id}`} onClick={() => onOpen(course.id)}>
        Open
      </button>
    </li>
  )
}
