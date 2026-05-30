'use client'
import { useMyCourses } from '../../hooks/useProgress'

export default function MyCoursesPage() {
  const myCourses = useMyCourses()

  if (myCourses.length === 0) {
    return (
      <section data-testid="page-my-courses">
        <p data-testid="no-enrollments">You are not enrolled in any courses.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-my-courses">
      <h1>My Courses</h1>
      <ul data-testid="my-course-list">
        {myCourses.map(({ course, progress }) => (
          <li key={course.id} data-testid={`my-course-${course.id}`}>
            <span data-testid={`my-course-${course.id}-title`}>{course.title}</span>
            <span data-testid={`my-course-${course.id}-percent`}>{progress.percent}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
