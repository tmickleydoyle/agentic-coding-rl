'use client'
import { useRoutine } from '../../components/RoutineProvider'

export default function LibraryPage() {
  const { library } = useRoutine()
  return (
    <section data-testid="page-library">
      <h1>Library</h1>
      <ul data-testid="library-list">
        {library.map((ex) => (
          <li key={ex.id} data-testid={`library-${ex.id}`}>
            <span data-testid={`library-${ex.id}-name`}>{ex.name}</span>
            <span data-testid={`library-${ex.id}-muscle`}>{ex.muscle}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
