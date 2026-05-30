'use client'
import { useMatrix } from '../../components/MatrixProvider'
import { useQuadrants } from '../../hooks/useQuadrants'
import QuadrantBox from '../../components/QuadrantBox'

export default function MatrixPage() {
  const { moveTo, removeTask } = useMatrix()
  const { byQuadrant, quadrants } = useQuadrants()
  return (
    <section data-testid="page-matrix">
      <h1>Matrix</h1>
      <div data-testid="quadrants">
        {quadrants.map((q) => (
          <QuadrantBox
            key={q}
            quadrant={q}
            tasks={byQuadrant[q]}
            onMove={moveTo}
            onDelete={removeTask}
          />
        ))}
      </div>
    </section>
  )
}
