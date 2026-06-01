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

describe('Help Desk Support Queue', () => {
  it('renders the Support Queue heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /support queue/i })).toBeInTheDocument()
  })

  it('shows the initial counts as Open: 0 | In Progress: 0 | Closed: 0', () => {
    render(<App />)
    expect(screen.getByText('Open: 0 | In Progress: 0 | Closed: 0')).toBeInTheDocument()
  })

  it('creates a ticket and shows it with Open status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Fix login bug')
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(within(liFor('Fix login bug')).getByText('Open')).toBeInTheDocument()
  })

  it('clears the input after creating a ticket', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'My ticket')
    expect(screen.getByLabelText(/ticket title/i)).toHaveValue('')
  })

  it('ignores blank ticket titles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /create ticket/i }))
    expect(screen.getByText('Open: 0 | In Progress: 0 | Closed: 0')).toBeInTheDocument()
  })

  it('updates Open count after creating a ticket', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Ticket A')
    expect(screen.getByText('Open: 1 | In Progress: 0 | Closed: 0')).toBeInTheDocument()
  })

  it('advances a ticket from Open to In Progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Ticket A')
    await u.click(within(liFor('Ticket A')).getByRole('button', { name: /advance/i }))
    expect(within(liFor('Ticket A')).getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Open: 0 | In Progress: 1 | Closed: 0')).toBeInTheDocument()
  })

  it('advances a ticket from In Progress to Closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Ticket A')
    await u.click(within(liFor('Ticket A')).getByRole('button', { name: /advance/i }))
    await u.click(within(liFor('Ticket A')).getByRole('button', { name: /advance/i }))
    expect(within(liFor('Ticket A')).getByText('Closed')).toBeInTheDocument()
    expect(screen.getByText('Open: 0 | In Progress: 0 | Closed: 1')).toBeInTheDocument()
  })

  it('disables Advance button for a Closed ticket', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Ticket A')
    await u.click(within(liFor('Ticket A')).getByRole('button', { name: /advance/i }))
    await u.click(within(liFor('Ticket A')).getByRole('button', { name: /advance/i }))
    expect(within(liFor('Ticket A')).getByRole('button', { name: /advance/i })).toBeDisabled()
  })

  it('filters by Open status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Alpha')
    await createTicket(u, 'Beta')
    await u.click(within(liFor('Alpha')).getByRole('button', { name: /advance/i }))
    await u.click(screen.getByRole('button', { name: /show open/i }))
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('filters by In Progress status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Alpha')
    await createTicket(u, 'Beta')
    await u.click(within(liFor('Alpha')).getByRole('button', { name: /advance/i }))
    await u.click(screen.getByRole('button', { name: /show in progress/i }))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('filters by Closed status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Alpha')
    await createTicket(u, 'Beta')
    await u.click(within(liFor('Alpha')).getByRole('button', { name: /advance/i }))
    await u.click(within(liFor('Alpha')).getByRole('button', { name: /advance/i }))
    await u.click(screen.getByRole('button', { name: /show closed/i }))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('Show All restores all tickets after filtering', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Alpha')
    await createTicket(u, 'Beta')
    await u.click(within(liFor('Alpha')).getByRole('button', { name: /advance/i }))
    await u.click(screen.getByRole('button', { name: /show open/i }))
    await u.click(screen.getByRole('button', { name: /show all/i }))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('counts reflect all tickets regardless of active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'T1')
    await createTicket(u, 'T2')
    await createTicket(u, 'T3')
    await u.click(within(liFor('T1')).getByRole('button', { name: /advance/i }))
    await u.click(within(liFor('T2')).getByRole('button', { name: /advance/i }))
    await u.click(within(liFor('T2')).getByRole('button', { name: /advance/i }))
    await u.click(screen.getByRole('button', { name: /show open/i }))
    expect(screen.getByText('Open: 1 | In Progress: 1 | Closed: 1')).toBeInTheDocument()
  })

  it('moving one ticket does not affect another', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'Solo')
    await createTicket(u, 'Other')
    await u.click(within(liFor('Solo')).getByRole('button', { name: /advance/i }))
    expect(within(liFor('Solo')).getByText('In Progress')).toBeInTheDocument()
    expect(within(liFor('Other')).getByText('Open')).toBeInTheDocument()
  })

  it('multiple tickets can be created and all start as Open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await createTicket(u, 'X')
    await createTicket(u, 'Y')
    await createTicket(u, 'Z')
    expect(screen.getByText('Open: 3 | In Progress: 0 | Closed: 0')).toBeInTheDocument()
  })
})
