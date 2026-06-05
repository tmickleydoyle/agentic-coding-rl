// HELD-OUT generalization tests — overlaid only at eval, never visible to the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function createTicket(u: ReturnType<typeof userEvent.setup>, title: string) {
  await u.clear(screen.getByLabelText(/ticket title/i))
  await u.type(screen.getByLabelText(/ticket title/i), title)
  await u.click(screen.getByRole('button', { name: /create ticket/i }))
}

function liFor(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`No <li> found for title: ${title}`)
  return el as HTMLElement
}

describe('Help Desk Support Queue (held-out)', () => {
  it('shows correct summary after many state transitions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Issue1')
    await createTicket(u, 'Issue2')
    await createTicket(u, 'Issue3')
    await createTicket(u, 'Issue4')
    // advance Issue1 to Closed
    await u.click(within(liFor('Issue1')).getByRole('button', { name: /advance/i }))
    await u.click(within(liFor('Issue1')).getByRole('button', { name: /advance/i }))
    // advance Issue2 to In Progress
    await u.click(within(liFor('Issue2')).getByRole('button', { name: /advance/i }))
    // Issue3 and Issue4 remain Open
    expect(screen.getByText('Open: 2 | In Progress: 1 | Closed: 1')).toBeInTheDocument()
  })

  it('a closed ticket remains closed after extra advance clicks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Stubborn')
    await u.click(within(liFor('Stubborn')).getByRole('button', { name: /advance/i }))
    await u.click(within(liFor('Stubborn')).getByRole('button', { name: /advance/i }))
    // button is disabled so further clicks should have no effect
    expect(within(liFor('Stubborn')).getByRole('button', { name: /advance/i })).toBeDisabled()
    expect(within(liFor('Stubborn')).getByText('Closed')).toBeInTheDocument()
    expect(screen.getByText('Open: 0 | In Progress: 0 | Closed: 1')).toBeInTheDocument()
  })

  it('filter by Closed shows only closed tickets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'ClosedOne')
    await createTicket(u, 'OpenOne')
    await u.click(within(liFor('ClosedOne')).getByRole('button', { name: /advance/i }))
    await u.click(within(liFor('ClosedOne')).getByRole('button', { name: /advance/i }))
    await u.click(screen.getByRole('button', { name: /show closed/i }))
    expect(screen.getByText('ClosedOne')).toBeInTheDocument()
    expect(screen.queryByText('OpenOne')).not.toBeInTheDocument()
  })

  it('switching filters back and forth shows correct sets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Ping')
    await createTicket(u, 'Pong')
    await u.click(within(liFor('Ping')).getByRole('button', { name: /advance/i }))
    // filter In Progress — only Ping visible
    await u.click(screen.getByRole('button', { name: /show in progress/i }))
    expect(screen.getByText('Ping')).toBeInTheDocument()
    expect(screen.queryByText('Pong')).not.toBeInTheDocument()
    // switch to Open — only Pong visible
    await u.click(screen.getByRole('button', { name: /show open/i }))
    expect(screen.queryByText('Ping')).not.toBeInTheDocument()
    expect(screen.getByText('Pong')).toBeInTheDocument()
    // Show All — both visible
    await u.click(screen.getByRole('button', { name: /show all/i }))
    expect(screen.getByText('Ping')).toBeInTheDocument()
    expect(screen.getByText('Pong')).toBeInTheDocument()
  })

  it('counts do not change when only the filter changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'A')
    await createTicket(u, 'B')
    await u.click(within(liFor('A')).getByRole('button', { name: /advance/i }))
    // record counts under Show All
    expect(screen.getByText('Open: 1 | In Progress: 1 | Closed: 0')).toBeInTheDocument()
    // switch filter — counts must stay the same
    await u.click(screen.getByRole('button', { name: /show in progress/i }))
    expect(screen.getByText('Open: 1 | In Progress: 1 | Closed: 0')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /show open/i }))
    expect(screen.getByText('Open: 1 | In Progress: 1 | Closed: 0')).toBeInTheDocument()
  })

  it('whitespace-only title is rejected and count stays zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/ticket title/i), '   ')
    await u.click(screen.getByRole('button', { name: /create ticket/i }))
    expect(screen.getByText('Open: 0 | In Progress: 0 | Closed: 0')).toBeInTheDocument()
  })
})
