'use client'
import { useApp } from '../../components/AppStateProvider'
import CourseCard from '../../components/CourseCard'

export default function CatalogPage() {
  const { courses, isEnrolled, openCourse } = useApp()
  return (
    <section data-testid="page-catalog">
      <h1>Catalog</h1>
      <ul data-testid="course-list">
        {courses.map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            enrolled={isEnrolled(c.id)}
            onOpen={openCourse}
          />
        ))}
      </ul>
    </section>
  )
}
