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
  // TODO: render course-<id> row: title, lesson-count, an enrolled-badge-<id> when
  // enrolled, and an open-<id> button.
  void enrolled
  void onOpen
  return <li data-testid={`course-${course.id}`} />
}
