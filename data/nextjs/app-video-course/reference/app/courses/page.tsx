'use client'
import { useApp } from '../../components/AppStateProvider'
import { allLessons, courseProgress } from '../../hooks/useCourse'
import CourseRow from '../../components/CourseRow'

export default function CoursesPage() {
  const { courses, completedKeys, openCourse } = useApp()
  return (
    <section data-testid="page-courses">
      <h1>Courses</h1>
      <ul data-testid="course-list">
        {courses.map((c) => (
          <CourseRow
            key={c.id}
            course={c}
            lessonCount={allLessons(c).length}
            percent={courseProgress(c, completedKeys).percent}
            onOpen={openCourse}
          />
        ))}
      </ul>
    </section>
  )
}
