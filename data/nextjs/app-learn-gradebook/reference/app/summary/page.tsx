'use client'
import { useApp } from '../../components/AppStateProvider'
import { useGradebook } from '../../hooks/useGrades'

export default function SummaryPage() {
  const { students } = useApp()
  const { rows, classAvg } = useGradebook()

  return (
    <section data-testid="page-summary">
      <h1>Summary</h1>
      <span data-testid="student-count-value">{students.length}</span>
      <span data-testid="class-average-value">{classAvg === null ? '—' : classAvg}</span>
      <ul data-testid="summary-list">
        {rows.map((row) => (
          <li key={row.student.id} data-testid={`summary-${row.student.id}`}>
            <span data-testid={`summary-${row.student.id}-name`}>{row.student.name}</span>
            <span data-testid={`summary-${row.student.id}-average`}>
              {row.average === null ? '—' : row.average}
            </span>
            <span data-testid={`summary-${row.student.id}-letter`}>{row.letter}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
