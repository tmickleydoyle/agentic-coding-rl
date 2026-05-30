'use client'
import { useApp } from '../../components/AppStateProvider'
import { findLesson, useSelectedCourse } from '../../hooks/useCourse'

export default function PlayerPage() {
  const { selectedLessonId, isComplete, toggleComplete } = useApp()
  const course = useSelectedCourse()
  const lesson = course ? findLesson(course, selectedLessonId) : undefined

  if (!course || !lesson) {
    return (
      <section data-testid="page-player">
        <p data-testid="no-lesson">No lesson selected.</p>
      </section>
    )
  }

  const complete = isComplete(course.id, lesson.id)

  return (
    <section data-testid="page-player">
      <h1 data-testid="player-title">{lesson.title}</h1>
      <span data-testid="player-duration">{lesson.duration}</span>
      <button data-testid="complete-toggle" onClick={() => toggleComplete(course.id, lesson.id)}>
        {complete ? 'Mark incomplete' : 'Mark complete'}
      </button>
      {complete ? <span data-testid="complete-flag">Complete</span> : null}
    </section>
  )
}
