'use client'
import { useSessions } from '../../hooks/useSessions'

export default function AgentsPage() {
  const { agents, agentLoad } = useSessions()
  return (
    <section data-testid="page-agents">
      <h1>Agents</h1>
      <ul data-testid="agent-list">
        {agents.map((a) => (
          <li key={a} data-testid={`agent-${a}`}>
            <span data-testid={`agent-${a}-name`}>{a}</span>
            <span data-testid={`agent-${a}-load`}>{agentLoad[a] ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
