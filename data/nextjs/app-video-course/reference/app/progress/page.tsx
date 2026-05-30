'use client'
import { useApp } from '../../components/AppStateProvider'
import { allLessons, courseProgress } from '../../hooks/useCourse'

export default function ProgressPage() {
  const { courses, completedKeys } = useApp()

  let totalLessons = 0
  courses.forEach((c) => {
    totalLessons += allLessons(c).length
  })
  const completed = completedKeys.length
  const overall = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100)

  return (
    <section data-testid="page-progress">
      <h1>Progress</h1>
      <span data-testid="completed-lessons-value">{completed}</span>
      <span data-testid="total-lessons-value">{totalLessons}</span>
      <span data-testid="overall-percent-value">{overall}</span>
      <ul data-testid="course-progress-list">
        {courses.map((c) => (
          <li key={c.id} data-testid={`cp-${c.id}`}>
            <span data-testid={`cp-${c.id}-percent`}>
              {courseProgress(c, completedKeys).percent}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
