'use client'
import { usePomodoro } from '../../components/PomodoroProvider'
import { useTimer } from '../../hooks/useTimer'
import Timer from '../../components/Timer'
import { SESSION_SECONDS } from '../../lib/types'

export default function FocusPage() {
  const { tasks, selectedId, completeSession } = usePomodoro()
  const selected = tasks.find((t) => t.id === selectedId) ?? null

  const { remaining, start, pause, reset } = useTimer(SESSION_SECONDS, () => {
    if (selectedId) completeSession(selectedId)
  })

  return (
    <section data-testid="page-focus">
      <h1>Focus</h1>
      {selected ? (
        <p data-testid="focus-task">{selected.title}</p>
      ) : (
        <p data-testid="no-task">No task selected</p>
      )}
      <Timer remaining={remaining} onStart={start} onPause={pause} onReset={reset} />
    </section>
  )
}
