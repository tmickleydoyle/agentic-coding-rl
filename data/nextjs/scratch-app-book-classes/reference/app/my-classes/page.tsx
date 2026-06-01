'use client'
import { useApp } from '../../components/AppStateProvider'
import EnrollmentRow from '../../components/EnrollmentRow'

export default function MyClassesPage() {
  const { enrollments, classes, cancel } = useApp()

  const className = (id: string): string =>
    classes.find((c) => c.id === id)?.name ?? 'Unknown'

  const enrolled = enrollments.filter((e) => e.status === 'enrolled')

  return (
    <section data-testid="page-my-classes">
      <h1>My Classes</h1>
      {enrolled.length === 0 ? (
        <p data-testid="empty-state">No enrolled classes.</p>
      ) : (
        <ul data-testid="enrolled-list">
          {enrolled.map((e) => (
            <EnrollmentRow
              key={e.id}
              enrollment={e}
              className={className(e.classId)}
              prefix="enrollment"
              onCancel={cancel}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
