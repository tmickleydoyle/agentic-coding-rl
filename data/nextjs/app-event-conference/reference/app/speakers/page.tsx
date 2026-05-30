'use client'
import { useApp } from '../../components/AppStateProvider'

export default function SpeakersPage() {
  const { sessions } = useApp()

  const counts: Record<string, number> = {}
  const order: string[] = []
  sessions.forEach((s) => {
    if (counts[s.speaker] === undefined) {
      counts[s.speaker] = 0
      order.push(s.speaker)
    }
    counts[s.speaker] += 1
  })

  return (
    <section data-testid="page-speakers">
      <h1>Speakers</h1>
      <ul data-testid="speakers-list">
        {order.map((name) => (
          <li key={name} data-testid={`speaker-${name}`}>
            <span>{name}</span>
            <span data-testid={`speaker-${name}-count`}>{counts[name]}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
