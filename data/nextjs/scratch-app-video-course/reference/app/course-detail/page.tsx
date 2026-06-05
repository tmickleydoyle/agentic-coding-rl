'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSelectedCourse } from '../../hooks/useCourse'
import LessonRow from '../../components/LessonRow'

export default function CourseDetailPage() {
  const { isComplete, playLesson } = useApp()
  const course = useSelectedCourse()

  if (!course) {
    return (
      <section data-testid="page-course-detail">
        <p data-testid="no-course">No course selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-course-detail">
      <h1 data-testid="detail-title">{course.title}</h1>
      {course.modules.map((m) => (
        <section key={m.id} data-testid={`module-${m.id}`}>
          <h2 data-testid={`module-${m.id}-title`}>{m.title}</h2>
          <ul>
            {m.lessons.map((l) => (
              <LessonRow
                key={l.id}
                courseId={course.id}
                lesson={l}
                complete={isComplete(course.id, l.id)}
                onPlay={playLesson}
              />
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
