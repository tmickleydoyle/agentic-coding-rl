import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('queue', () => {
  it('shows status counts over the seeded tickets', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-open-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-pending-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-resolved-value')).toHaveTextContent('1')
  })

  it('filters by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'open')
    const list = screen.getByTestId('queue-list')
    expect(within(list).getByTestId('queue-k1')).toBeInTheDocument()
    expect(within(list).getByTestId('queue-k3')).toBeInTheDocument()
    expect(within(list).queryByTestId('queue-k2')).not.toBeInTheDocument()
  })

  it('filters by priority', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    await user.selectOptions(screen.getByTestId('priority-filter'), 'urgent')
    const list = screen.getByTestId('queue-list')
    expect(within(list).getByTestId('queue-k4')).toBeInTheDocument()
    expect(within(list).queryByTestId('queue-k1')).not.toBeInTheDocument()
  })

  it('filters by unassigned', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    await user.selectOptions(screen.getByTestId('assignee-filter'), 'unassigned')
    const list = screen.getByTestId('queue-list')
    expect(within(list).getByTestId('queue-k2')).toBeInTheDocument()
    expect(within(list).queryByTestId('queue-k1')).not.toBeInTheDocument()
  })

  it('filters by a specific assignee', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    await user.selectOptions(screen.getByTestId('assignee-filter'), 'alice')
    const list = screen.getByTestId('queue-list')
    expect(within(list).getByTestId('queue-k1')).toBeInTheDocument()
    expect(within(list).getByTestId('queue-k4')).toBeInTheDocument()
    expect(within(list).queryByTestId('queue-k3')).not.toBeInTheDocument()
  })

  it('shows an empty state when no ticket matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'resolved')
    await user.selectOptions(screen.getByTestId('priority-filter'), 'low')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })
})
