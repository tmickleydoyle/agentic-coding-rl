'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ProgressPage() {
  const { courses, enrollments } = useApp()

  let completedLessons = 0
  let totalLessons = 0
  enrollments.forEach((e) => {
    const course = courses.find((c) => c.id === e.courseId)
    if (!course) return
    completedLessons += e.completedLessonIds.length
    totalLessons += course.lessons.length
  })
  const overall = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)

  return (
    <section data-testid="page-progress">
      <h1>Progress</h1>
      <span data-testid="enrolled-count-value">{enrollments.length}</span>
      <span data-testid="completed-lessons-value">{completedLessons}</span>
      <span data-testid="overall-percent-value">{overall}</span>
    </section>
  )
}
