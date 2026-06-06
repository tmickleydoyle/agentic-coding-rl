import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Ticket Queue', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /ticket queue/i })).toBeInTheDocument()
  })

  it('shows correct initial counts', () => {
    render(<App />)
    expect(screen.getByTestId('count-open')).toHaveTextContent('Open: 3')
    expect(screen.getByTestId('count-in-progress')).toHaveTextContent('In Progress: 1')
    expect(screen.getByTestId('count-resolved')).toHaveTextContent('Resolved: 1')
  })

  it('shows all 5 tickets by default', () => {
    render(<App />)
    expect(screen.getByTestId('showing-count')).toHaveTextContent('Showing 5 tickets')
  })

  it('shows priority badges', () => {
    render(<App />)
    expect(screen.getByTestId('priority-1')).toHaveTextContent('high')
    expect(screen.getByTestId('priority-3')).toHaveTextContent('medium')
    expect(screen.getByTestId('priority-2')).toHaveTextContent('low')
  })

  it('filters by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'open')
    expect(screen.getByTestId('showing-count')).toHaveTextContent('Showing 3 tickets')
    expect(screen.queryByTestId('ticket-3')).not.toBeInTheDocument()
  })

  it('filters by priority', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by priority/i), 'high')
    expect(screen.getByTestId('showing-count')).toHaveTextContent('Showing 2 tickets')
  })

  it('combines status and priority filters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'open')
    await user.selectOptions(screen.getByLabelText(/filter by priority/i), 'high')
    expect(screen.getByTestId('showing-count')).toHaveTextContent('Showing 1 tickets')
    expect(screen.getByTestId('ticket-1')).toBeInTheDocument()
  })

  it('updates ticket status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/status for login page broken/i), 'resolved')
    expect(screen.getByTestId('count-resolved')).toHaveTextContent('Resolved: 2')
    expect(screen.getByTestId('count-open')).toHaveTextContent('Open: 2')
  })

  it('adds a new ticket', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/ticket title/i), 'New Bug')
    await user.selectOptions(screen.getByLabelText(/^priority$/i), 'high')
    await user.type(screen.getByLabelText(/submitter name/i), 'Frank')
    await user.click(screen.getByRole('button', { name: /add ticket/i }))
    expect(screen.getByTestId('showing-count')).toHaveTextContent('Showing 6 tickets')
    expect(screen.getByTestId('count-open')).toHaveTextContent('Open: 4')
  })

  it('clears form after adding ticket', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/ticket title/i), 'Test')
    await user.type(screen.getByLabelText(/submitter name/i), 'Grace')
    await user.click(screen.getByRole('button', { name: /add ticket/i }))
    expect(screen.getByLabelText(/ticket title/i)).toHaveValue('')
    expect(screen.getByLabelText(/submitter name/i)).toHaveValue('')
  })

  it('does not add ticket with empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/submitter name/i), 'Grace')
    await user.click(screen.getByRole('button', { name: /add ticket/i }))
    expect(screen.getByTestId('showing-count')).toHaveTextContent('Showing 5 tickets')
  })

  it('high priority tickets appear before low priority in list', () => {
    render(<App />)
    const items = screen.getAllByTestId(/^ticket-\d+$/)
    const firstId = items[0].getAttribute('data-testid')
    // First item should be a high priority ticket (id 1 or 4)
    expect(['ticket-1', 'ticket-4']).toContain(firstId)
    const lastId = items[items.length - 1].getAttribute('data-testid')
    expect(lastId).toBe('ticket-2')
  })
})
