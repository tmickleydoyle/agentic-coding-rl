'use client'
import { useApp } from '../../components/AppStateProvider'
import { studentAverage } from '../../lib/grades'
import GradeCell from '../../components/GradeCell'

export default function GradebookPage() {
  const { students, assignments, grades, getGrade, setGrade, clearGrade } = useApp()

  const onCellChange = (sid: string, aid: string, raw: string) => {
    if (raw.trim() === '') {
      clearGrade(sid, aid)
      return
    }
    const n = Number(raw)
    if (!Number.isNaN(n)) setGrade(sid, aid, n)
  }

  return (
    <section data-testid="page-gradebook">
      <h1>Gradebook</h1>
      <table data-testid="grade-grid">
        <tbody>
          {students.map((s) => {
            const avg = studentAverage(grades, s, assignments)
            return (
              <tr key={s.id} data-testid={`grade-row-${s.id}`}>
                <td data-testid={`grade-row-${s.id}-name`}>{s.name}</td>
                {assignments.map((a) => (
                  <td key={a.id}>
                    <GradeCell
                      studentId={s.id}
                      assignmentId={a.id}
                      value={getGrade(s.id, a.id)}
                      onChange={(raw) => onCellChange(s.id, a.id, raw)}
                    />
                  </td>
                ))}
                <td>
                  <span data-testid={`avg-${s.id}-value`}>{avg === null ? '—' : avg}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
