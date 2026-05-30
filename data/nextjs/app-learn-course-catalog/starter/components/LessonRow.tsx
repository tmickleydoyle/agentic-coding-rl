'use client'
import type { Lesson } from '../lib/types'

export default function LessonRow({
  lesson,
  complete,
  onToggle,
}: {
  lesson: Lesson
  complete: boolean
  onToggle: (lessonId: string) => void
}) {
  // TODO: render lesson-<id> row with data-complete, the title, and a lesson-toggle-<id>
  // button.
  void complete
  void onToggle
  return <li data-testid={`lesson-${lesson.id}`} />
}
