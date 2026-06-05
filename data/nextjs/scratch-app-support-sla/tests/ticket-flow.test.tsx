import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('ticket flow', () => {
  it('lists seeded tickets with remaining minutes and breach flag', () => {
    render(<App />)
    const list = screen.getByTestId('ticket-list')
    expect(within(list).getByText('Login outage')).toBeInTheDocument()
    // k1: sla 60 - elapsed 90 = -30, breached
    expect(screen.getByTestId('ticket-k1-remaining')).toHaveTextContent('-30')
    expect(screen.getByTestId('ticket-k1-breached')).toHaveTextContent('BREACHED')
    // k2: sla 120 - elapsed 30 = 90, ok
    expect(screen.getByTestId('ticket-k2-remaining')).toHaveTextContent('90')
    expect(screen.getByTestId('ticket-k2-breached')).toHaveTextContent('OK')
  })

  it('marks breached tickets via the row data attribute', () => {
    render(<App />)
    expect(screen.getByTestId('ticket-k1')).toHaveAttribute('data-breached', 'true')
    expect(screen.getByTestId('ticket-k3')).toHaveAttribute('data-breached', 'true')
    expect(screen.getByTestId('ticket-k5')).toHaveAttribute('data-breached', 'true')
    expect(screen.getByTestId('ticket-k2')).toHaveAttribute('data-breached', 'false')
    expect(screen.getByTestId('ticket-k4')).toHaveAttribute('data-breached', 'false')
  })

  it('a responded but past-sla ticket is not breached', () => {
    render(<App />)
    // k4: elapsed 300 > sla 240 but responded => not breached
    expect(screen.getByTestId('ticket-k4-breached')).toHaveTextContent('OK')
  })

  it('shows a no-selection message before opening', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-ticket-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('opens a ticket and shows its SLA detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    expect(screen.getByTestId('page-ticket-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-subject')).toHaveTextContent('Login outage')
    expect(screen.getByTestId('detail-sla')).toHaveTextContent('60')
    expect(screen.getByTestId('detail-elapsed')).toHaveTextContent('90')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('BREACHED')
    expect(screen.getByTestId('detail-responded')).toHaveTextContent('awaiting')
  })

  it('responding clears the breach on the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('BREACHED')
    await user.click(screen.getByTestId('respond-btn'))
    expect(screen.getByTestId('detail-responded')).toHaveTextContent('responded')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('OK')
  })

  it('escalating bumps the priority and marks escalated', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    expect(screen.getByTestId('detail-priority')).toHaveTextContent('high')
    await user.click(screen.getByTestId('escalate-btn'))
    expect(screen.getByTestId('detail-priority')).toHaveTextContent('urgent')
    expect(screen.getByTestId('detail-escalated')).toHaveTextContent('escalated')
  })

  it('escalating an urgent ticket keeps it urgent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k3'))
    expect(screen.getByTestId('detail-priority')).toHaveTextContent('urgent')
    await user.click(screen.getByTestId('escalate-btn'))
    expect(screen.getByTestId('detail-priority')).toHaveTextContent('urgent')
    expect(screen.getByTestId('detail-escalated')).toHaveTextContent('escalated')
  })

  it('persists a response back onto the tickets list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k5'))
    await user.click(screen.getByTestId('respond-btn'))
    await user.click(screen.getByTestId('nav-tickets'))
    expect(screen.getByTestId('ticket-k5-breached')).toHaveTextContent('OK')
    expect(screen.getByTestId('ticket-k5')).toHaveAttribute('data-breached', 'false')
  })
})
