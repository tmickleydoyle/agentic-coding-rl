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
  return (
    <li data-testid={`lesson-${lesson.id}`} data-complete={complete ? 'true' : 'false'}>
      <span data-testid={`lesson-${lesson.id}-title`}>{lesson.title}</span>
      <button data-testid={`lesson-toggle-${lesson.id}`} onClick={() => onToggle(lesson.id)}>
        {complete ? 'Mark incomplete' : 'Mark complete'}
      </button>
    </li>
  )
}
