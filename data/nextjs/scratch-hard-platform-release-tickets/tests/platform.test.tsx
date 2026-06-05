import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addRelease(u: U, name: string) {
  await u.clear(screen.getByLabelText(/release name/i))
  await u.type(screen.getByLabelText(/release name/i), name)
  await u.click(screen.getByRole('button', { name: /add release/i }))
}

async function addTicket(u: U, release: string, summary: string, points: string) {
  await u.selectOptions(screen.getByLabelText(/^release$/i), release)
  await u.clear(screen.getByLabelText(/summary/i))
  await u.type(screen.getByLabelText(/summary/i), summary)
  await u.clear(screen.getByLabelText(/points/i))
  if (points) await u.type(screen.getByLabelText(/points/i), points)
  await u.click(screen.getByRole('button', { name: /add ticket/i }))
}

const readiness = () => screen.getByRole('region', { name: 'Readiness view' })
const ticketsView = () => screen.getByRole('region', { name: 'Tickets view' })

describe('Release readiness board', () => {
  it('starts on Releases', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Releases' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Tickets')
    expect(screen.getByRole('heading', { name: 'Tickets' })).toBeInTheDocument()
    await nav(u, 'Readiness')
    expect(screen.getByRole('heading', { name: 'Readiness' })).toBeInTheDocument()
    await nav(u, 'Releases')
    expect(screen.getByRole('heading', { name: 'Releases' })).toBeInTheDocument()
  })

  it('adds a release shown in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    expect(screen.getByText('v1.0')).toBeInTheDocument()
  })

  it('ignores a blank release name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add release/i }))
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/next release: none/i)).toBeInTheDocument()
  })

  it('trims whitespace from a release name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, '  v2.0  ')
    expect(screen.getByText('v2.0')).toBeInTheDocument()
  })

  it('adds a ticket rendered with points, status, and release', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'Login flow', '3')
    expect(screen.getByText('Login flow (3 pts) - todo [v1.0]')).toBeInTheDocument()
  })

  it('treats blank points as 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'Small', '')
    expect(screen.getByText('Small (1 pts) - todo [v1.0]')).toBeInTheDocument()
  })

  it('clamps points below 1 to 1 and rounds down', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'Tiny', '0')
    await addTicket(u, 'v1.0', 'Frac', '2.9')
    expect(screen.getByText('Tiny (1 pts) - todo [v1.0]')).toBeInTheDocument()
    expect(screen.getByText('Frac (2 pts) - todo [v1.0]')).toBeInTheDocument()
  })

  it('ignores a ticket with a blank summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await u.selectOptions(screen.getByLabelText(/^release$/i), 'v1.0')
    await u.click(screen.getByRole('button', { name: /add ticket/i }))
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/v1\.0: 0\/0 pts done/i)).toBeInTheDocument()
  })

  it('resolves a ticket and removes its Resolve button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'Work', '5')
    await u.click(within(ticketsView()).getByRole('button', { name: /resolve/i }))
    expect(screen.getByText('Work (5 pts) - done [v1.0]')).toBeInTheDocument()
    expect(within(ticketsView()).queryByRole('button', { name: /resolve/i })).not.toBeInTheDocument()
  })

  it('sums done and total points per release (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'A', '3')
    await addTicket(u, 'v1.0', 'B', '2')
    await u.click(within(ticketsView()).getAllByRole('button', { name: /resolve/i })[0])
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/v1\.0: 3\/5 pts done/i)).toBeInTheDocument()
  })

  it('shows a release with no tickets as 0/0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v9.0')
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/v9\.0: 0\/0 pts done/i)).toBeInTheDocument()
  })

  it('marks a release ready to ship when all tickets resolved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'A', '3')
    await u.click(within(ticketsView()).getByRole('button', { name: /resolve/i }))
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/ready to ship/i)).toBeInTheDocument()
  })

  it('does not mark ready to ship with an unresolved ticket', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'A', '3')
    await addTicket(u, 'v1.0', 'B', '2')
    await u.click(within(ticketsView()).getAllByRole('button', { name: /resolve/i })[0])
    await nav(u, 'Readiness')
    expect(within(readiness()).queryByText(/ready to ship/i)).not.toBeInTheDocument()
  })

  it('does not mark an empty release ready to ship', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Readiness')
    expect(within(readiness()).queryByText(/ready to ship/i)).not.toBeInTheDocument()
  })

  it('totals open points across releases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await addRelease(u, 'v2.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'A', '3')
    await addTicket(u, 'v2.0', 'B', '4')
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/open points: 7/i)).toBeInTheDocument()
  })

  it('reduces open points after resolving', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'A', '3')
    await addTicket(u, 'v1.0', 'B', '2')
    await u.click(within(ticketsView()).getAllByRole('button', { name: /resolve/i })[0])
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/open points: 2/i)).toBeInTheDocument()
  })

  it('names the next release by most open points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await addRelease(u, 'v2.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'A', '3')
    await addTicket(u, 'v2.0', 'B', '8')
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/next release: v2\.0/i)).toBeInTheDocument()
  })

  it('shows next release none when no open points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/next release: none/i)).toBeInTheDocument()
  })

  it('keeps state across navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'A', '4')
    await nav(u, 'Releases')
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/v1\.0: 0\/4 pts done/i)).toBeInTheDocument()
  })
})
