import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('ticket flow', () => {
  it('lists seeded tickets with status, priority and assignee', () => {
    render(<App />)
    const list = screen.getByTestId('ticket-list')
    expect(within(list).getByText('Cannot log in')).toBeInTheDocument()
    expect(screen.getByTestId('ticket-k1-status')).toHaveTextContent('open')
    expect(screen.getByTestId('ticket-k1-priority')).toHaveTextContent('high')
    expect(screen.getByTestId('ticket-k1-assignee')).toHaveTextContent('alice')
    expect(screen.getByTestId('ticket-k2-assignee')).toHaveTextContent('Unassigned')
  })

  it('reflects status and priority as row data attributes', () => {
    render(<App />)
    expect(screen.getByTestId('ticket-k4')).toHaveAttribute('data-status', 'resolved')
    expect(screen.getByTestId('ticket-k4')).toHaveAttribute('data-priority', 'urgent')
  })

  it('shows a no-selection message before opening', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-ticket-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('opens a ticket and shows its details and transcript', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    expect(screen.getByTestId('page-ticket-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-subject')).toHaveTextContent('Cannot log in')
    expect(screen.getByTestId('detail-requester')).toHaveTextContent('dana')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('open')
    const transcript = screen.getByTestId('transcript')
    expect(within(transcript).getByText('Looking into it.')).toBeInTheDocument()
  })

  it('assigns a ticket from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k2'))
    expect(screen.getByTestId('detail-assignee')).toHaveTextContent('Unassigned')
    await user.type(screen.getByTestId('assignee-input'), 'carol')
    await user.click(screen.getByTestId('assign-btn'))
    expect(screen.getByTestId('detail-assignee')).toHaveTextContent('carol')
  })

  it('unassigns when assigning an empty value', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    expect(screen.getByTestId('detail-assignee')).toHaveTextContent('alice')
    await user.click(screen.getByTestId('assign-btn'))
    expect(screen.getByTestId('detail-assignee')).toHaveTextContent('Unassigned')
  })

  it('changes the status from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    await user.selectOptions(screen.getByTestId('status-select'), 'resolved')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('resolved')
  })

  it('adds a reply to the transcript', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k2'))
    await user.type(screen.getByTestId('reply-input'), 'We are on it')
    await user.click(screen.getByTestId('reply-btn'))
    const transcript = screen.getByTestId('transcript')
    expect(within(transcript).getByText('We are on it')).toBeInTheDocument()
  })

  it('persists an assignment back on the tickets list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k2'))
    await user.type(screen.getByTestId('assignee-input'), 'dave')
    await user.click(screen.getByTestId('assign-btn'))
    await user.click(screen.getByTestId('nav-tickets'))
    expect(screen.getByTestId('ticket-k2-assignee')).toHaveTextContent('dave')
  })

  it('creates a new ticket from the form', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('subject-input'), 'Printer offline')
    await user.type(screen.getByTestId('requester-input'), 'hank')
    await user.selectOptions(screen.getByTestId('priority-select'), 'high')
    await user.click(screen.getByTestId('submit-ticket'))
    expect(screen.getByTestId('page-tickets')).toBeInTheDocument()
    const list = screen.getByTestId('ticket-list')
    expect(within(list).getByText('Printer offline')).toBeInTheDocument()
  })

  it('shows a validation error when subject is blank', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.click(screen.getByTestId('submit-ticket'))
    expect(screen.getByTestId('form-error')).toHaveTextContent('Subject is required')
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
  })
})
