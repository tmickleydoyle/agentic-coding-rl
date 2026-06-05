'use client'
import { useApp } from '../../components/AppStateProvider'
import { useBoard } from '../../hooks/useBoard'
import TaskCard from '../../components/TaskCard'
import type { Task, TaskStatus } from '../../lib/types'

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'doing', label: 'Doing' },
  { status: 'done', label: 'Done' },
]

export default function BoardPage() {
  const { setTaskStatus } = useApp()
  const { byStatus } = useBoard()
  const lists: Record<TaskStatus, Task[]> = {
    todo: byStatus.todo,
    doing: byStatus.doing,
    done: byStatus.done,
  }
  return (
    <section data-testid="page-board">
      <h1>Board</h1>
      {COLUMNS.map((c) => (
        <div key={c.status} data-testid={`column-${c.status}`}>
          <h2>{c.label}</h2>
          <span data-testid={`column-${c.status}-count`}>{lists[c.status].length}</span>
          <ul data-testid={`column-${c.status}-list`}>
            {lists[c.status].map((t) => (
              <TaskCard key={t.id} task={t} onAdvance={setTaskStatus} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
