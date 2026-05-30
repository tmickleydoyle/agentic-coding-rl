'use client'
import { usePomodoro } from '../../components/PomodoroProvider'

export default function StatsPage() {
  const { tasks } = usePomodoro()
  const totalSessions = tasks.reduce((sum, t) => sum + t.sessions, 0)
  const completedTasks = tasks.filter((t) => t.done).length

  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <span data-testid="total-sessions">{totalSessions}</span>
      <span data-testid="completed-tasks">{completedTasks}</span>
      <ul data-testid="stat-list">
        {tasks.map((t) => (
          <li key={t.id} data-testid={`stat-${t.id}`}>
            <span data-testid={`stat-${t.id}-title`}>{t.title}</span>
            <span data-testid={`stat-${t.id}-sessions`}>{t.sessions}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
