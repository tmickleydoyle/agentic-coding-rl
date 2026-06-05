'use client'
import { useApp } from '../../components/AppStateProvider'
import { findCourse } from '../../hooks/useProgress'
import LessonRow from '../../components/LessonRow'

export default function CourseDetailPage() {
  const {
    courses,
    enrollments,
    selectedCourseId,
    isEnrolled,
    enroll,
    unenroll,
    toggleLesson,
  } = useApp()
  const course = findCourse(courses, selectedCourseId)

  if (!course) {
    return (
      <section data-testid="page-course-detail">
        <p data-testid="no-course">No course selected.</p>
      </section>
    )
  }

  const enrolled = isEnrolled(course.id)
  const enrollment = enrollments.find((e) => e.courseId === course.id)
  const isComplete = (lessonId: string): boolean =>
    enrollment ? enrollment.completedLessonIds.includes(lessonId) : false

  return (
    <section data-testid="page-course-detail">
      <h1 data-testid="detail-title">{course.title}</h1>
      <button
        data-testid="enroll-toggle"
        onClick={() => (enrolled ? unenroll(course.id) : enroll(course.id))}
      >
        {enrolled ? 'Unenroll' : 'Enroll'}
      </button>
      {enrolled ? (
        <ul data-testid="lesson-list">
          {course.lessons.map((l) => (
            <LessonRow
              key={l.id}
              lesson={l}
              complete={isComplete(l.id)}
              onToggle={(lessonId) => toggleLesson(course.id, lessonId)}
            />
          ))}
        </ul>
      ) : null}
    </section>
  )
}
