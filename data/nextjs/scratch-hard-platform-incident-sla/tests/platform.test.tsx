import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function logIncident(u: U, title: string, priority: string, hours: string) {
  await u.clear(screen.getByLabelText(/title/i))
  await u.type(screen.getByLabelText(/title/i), title)
  await u.selectOptions(screen.getByLabelText(/priority/i), priority)
  await u.clear(screen.getByLabelText(/hours open/i))
  if (hours) await u.type(screen.getByLabelText(/hours open/i), hours)
  await u.click(screen.getByRole('button', { name: /log incident/i }))
}

const board = () => screen.getByRole('region', { name: 'Board view' })
const sla = () => screen.getByRole('region', { name: 'SLA view' })
const incidentsView = () => screen.getByRole('region', { name: 'Incidents view' })

describe('Incident SLA tracker', () => {
  it('starts on Incidents', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Incidents' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
    await nav(u, 'SLA')
    expect(screen.getByRole('heading', { name: 'SLA' })).toBeInTheDocument()
    await nav(u, 'Incidents')
    expect(screen.getByRole('heading', { name: 'Incidents' })).toBeInTheDocument()
  })

  it('logs an incident rendered with priority, hours, and status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'DB down', 'P1', '2')
    expect(screen.getByText('DB down [P1] - 2h - active')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /log incident/i }))
    await nav(u, 'SLA')
    expect(within(sla()).getByText(/worst incident: none/i)).toBeInTheDocument()
  })

  it('treats blank hours as 0 and rounds hours down', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '')
    await logIncident(u, 'B', 'P2', '5.8')
    expect(screen.getByText('A [P1] - 0h - active')).toBeInTheDocument()
    expect(screen.getByText('B [P2] - 5h - active')).toBeInTheDocument()
  })

  it('resolves an incident and removes its Resolve button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '1')
    await u.click(within(incidentsView()).getByRole('button', { name: /resolve/i }))
    expect(screen.getByText('A [P1] - 1h - resolved')).toBeInTheDocument()
    expect(within(incidentsView()).queryByRole('button', { name: /resolve/i })).not.toBeInTheDocument()
  })

  it('marks a P1 on track below 3 hours on the board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '2')
    await nav(u, 'Board')
    expect(within(board()).getByText('A: on track')).toBeInTheDocument()
  })

  it('marks a P1 at risk at 3 hours (75% of 4)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '3')
    await nav(u, 'Board')
    expect(within(board()).getByText('A: at risk')).toBeInTheDocument()
  })

  it('marks a P1 breached at 4 hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '4')
    await nav(u, 'Board')
    expect(within(board()).getByText('A: breached')).toBeInTheDocument()
  })

  it('uses the P2 24-hour target for its bands', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P2', '18')
    await logIncident(u, 'B', 'P2', '24')
    await nav(u, 'Board')
    expect(within(board()).getByText('A: at risk')).toBeInTheDocument()
    expect(within(board()).getByText('B: breached')).toBeInTheDocument()
  })

  it('shows No active incidents on an empty board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Board')
    expect(within(board()).getByText(/no active incidents/i)).toBeInTheDocument()
  })

  it('hides resolved incidents from the board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '5')
    await u.click(within(incidentsView()).getByRole('button', { name: /resolve/i }))
    await nav(u, 'Board')
    expect(within(board()).getByText(/no active incidents/i)).toBeInTheDocument()
  })

  it('counts breached active incidents on SLA', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '5')
    await logIncident(u, 'B', 'P2', '30')
    await logIncident(u, 'C', 'P1', '1')
    await nav(u, 'SLA')
    expect(within(sla()).getByText(/breached: 2/i)).toBeInTheDocument()
  })

  it('counts at-risk active incidents on SLA', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '3')
    await logIncident(u, 'B', 'P2', '20')
    await nav(u, 'SLA')
    expect(within(sla()).getByText(/at risk: 2/i)).toBeInTheDocument()
  })

  it('counts resolved incidents on SLA', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '1')
    await logIncident(u, 'B', 'P1', '1')
    await u.click(within(incidentsView()).getAllByRole('button', { name: /resolve/i })[0])
    await nav(u, 'SLA')
    expect(within(sla()).getByText(/resolved: 1/i)).toBeInTheDocument()
  })

  it('excludes resolved incidents from the breached count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '6')
    await u.click(within(incidentsView()).getByRole('button', { name: /resolve/i }))
    await nav(u, 'SLA')
    expect(within(sla()).getByText(/breached: 0/i)).toBeInTheDocument()
    expect(within(sla()).getByText(/resolved: 1/i)).toBeInTheDocument()
  })

  it('names the worst incident by ratio across priorities', async () => {
    const u = userEvent.setup()
    render(<App />)
    // P1 6h -> ratio 1.5; P2 18h -> ratio 0.75
    await logIncident(u, 'Big', 'P1', '6')
    await logIncident(u, 'Small', 'P2', '18')
    await nav(u, 'SLA')
    expect(within(sla()).getByText(/worst incident: big/i)).toBeInTheDocument()
  })

  it('breaks a worst-incident tie toward the one logged first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'First', 'P1', '4')
    await logIncident(u, 'Second', 'P1', '4')
    await nav(u, 'SLA')
    expect(within(sla()).getByText(/worst incident: first/i)).toBeInTheDocument()
  })

  it('shows worst incident none when all are resolved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '5')
    await u.click(within(incidentsView()).getByRole('button', { name: /resolve/i }))
    await nav(u, 'SLA')
    expect(within(sla()).getByText(/worst incident: none/i)).toBeInTheDocument()
  })

  it('keeps state across navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logIncident(u, 'A', 'P1', '4')
    await nav(u, 'SLA')
    await nav(u, 'Incidents')
    await nav(u, 'Board')
    expect(within(board()).getByText('A: breached')).toBeInTheDocument()
  })
})
