// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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

describe('Release readiness (held-out)', () => {
  it('tracks two releases independently by points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await addRelease(u, 'v2.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'A', '3')
    await addTicket(u, 'v2.0', 'B', '5')
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/v1\.0: 0\/3 pts done/i)).toBeInTheDocument()
    expect(within(readiness()).getByText(/v2\.0: 0\/5 pts done/i)).toBeInTheDocument()
  })

  it('flips a release to ready to ship once its last ticket resolves', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'A', '2')
    await addTicket(u, 'v1.0', 'B', '3')
    await u.click(within(ticketsView()).getAllByRole('button', { name: /resolve/i })[0])
    await u.click(within(ticketsView()).getByRole('button', { name: /resolve/i }))
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/v1\.0: 5\/5 pts done/i)).toBeInTheDocument()
    expect(within(readiness()).getByText(/ready to ship/i)).toBeInTheDocument()
  })

  it('breaks a next-release tie toward the release added first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'alpha')
    await addRelease(u, 'beta')
    await nav(u, 'Tickets')
    await addTicket(u, 'alpha', 'A', '4')
    await addTicket(u, 'beta', 'B', '4')
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/next release: alpha/i)).toBeInTheDocument()
  })

  it('excludes resolved points from next-release selection', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRelease(u, 'v1.0')
    await addRelease(u, 'v2.0')
    await nav(u, 'Tickets')
    await addTicket(u, 'v1.0', 'big', '9')
    await addTicket(u, 'v2.0', 'small', '2')
    await u.click(within(ticketsView()).getAllByRole('button', { name: /resolve/i })[0])
    await nav(u, 'Readiness')
    expect(within(readiness()).getByText(/next release: v2\.0/i)).toBeInTheDocument()
  })
})
