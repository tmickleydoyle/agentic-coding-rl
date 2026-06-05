'use client'
import type { Lesson } from '../lib/types'

export default function LessonRow({
  courseId,
  lesson,
  complete,
  onPlay,
}: {
  courseId: string
  lesson: Lesson
  complete: boolean
  onPlay: (courseId: string, lessonId: string) => void
}) {
  return (
    <li
      data-testid={`lesson-${courseId}-${lesson.id}`}
      data-complete={complete ? 'true' : 'false'}
    >
      <span data-testid={`lesson-${courseId}-${lesson.id}-title`}>{lesson.title}</span>
      <button
        data-testid={`play-${courseId}-${lesson.id}`}
        onClick={() => onPlay(courseId, lesson.id)}
      >
        Play
      </button>
    </li>
  )
}
