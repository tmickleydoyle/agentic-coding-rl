'use client'
import { useApp } from '../../components/AppStateProvider'
import { useEnrollments } from '../../hooks/useEnrollments'
import ClassCard from '../../components/ClassCard'

export default function ClassesPage() {
  const { classes, openClass } = useApp()
  const { enrolledCount } = useEnrollments()
  return (
    <section data-testid="page-classes">
      <h1>Classes</h1>
      <ul data-testid="classes-list">
        {classes.map((c) => (
          <ClassCard key={c.id} klass={c} enrolled={enrolledCount(c.id)} onOpen={openClass} />
        ))}
      </ul>
    </section>
  )
}
