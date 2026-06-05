'use client'
import { useApp } from '../../components/AppStateProvider'
import EnrollmentRow from '../../components/EnrollmentRow'

export default function WaitlistPage() {
  const { enrollments, classes, cancel } = useApp()

  const className = (id: string): string =>
    classes.find((c) => c.id === id)?.name ?? 'Unknown'

  const waitlisted = enrollments.filter((e) => e.status === 'waitlisted')

  return (
    <section data-testid="page-waitlist">
      <h1>Waitlist</h1>
      {waitlisted.length === 0 ? (
        <p data-testid="waitlist-empty">Nobody is waitlisted.</p>
      ) : (
        <ul data-testid="waitlist-list">
          {waitlisted.map((e) => (
            <EnrollmentRow
              key={e.id}
              enrollment={e}
              className={className(e.classId)}
              prefix="waitlisted"
              onCancel={cancel}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
