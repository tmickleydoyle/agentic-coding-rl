import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Leave Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /leave tracker/i })).toBeInTheDocument()
  })

  it('shows all 4 seed leave requests', () => {
    expect(screen.getAllByTestId('leave-row')).toHaveLength(4)
  })

  it('shows correct stats for seed data', () => {
    expect(screen.getByTestId('stat-total')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-pending')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-approved')).toHaveTextContent('2')
  })

  it('filters by Pending status', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /^pending$/i }))
    expect(screen.getAllByTestId('leave-row')).toHaveLength(1)
    expect(screen.getByTestId('leave-employee')).toHaveTextContent('Carol White')
  })

  it('filters by Approved status', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /^approved$/i }))
    expect(screen.getAllByTestId('leave-row')).toHaveLength(2)
  })

  it('All filter shows all requests', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /^pending$/i }))
    await user.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getAllByTestId('leave-row')).toHaveLength(4)
  })

  it('approves a pending request', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /^pending$/i }))
    await user.click(screen.getByRole('button', { name: /^approve$/i }))
    await user.click(screen.getByRole('button', { name: /^all$/i }))
    const statuses = screen.getAllByTestId('leave-status').map(el => el.textContent)
    expect(statuses.filter(s => s === 'Pending')).toHaveLength(0)
    expect(screen.getByTestId('stat-pending')).toHaveTextContent('0')
  })

  it('rejects a pending request', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /^pending$/i }))
    await user.click(screen.getByRole('button', { name: /^reject$/i }))
    await user.click(screen.getByRole('button', { name: /^all$/i }))
    const statuses = screen.getAllByTestId('leave-status').map(el => el.textContent)
    expect(statuses.filter(s => s === 'Rejected')).toHaveLength(2)
  })

  it('deletes a leave request', async () => {
    const user = userEvent.setup()
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('leave-row')).toHaveLength(3)
    expect(screen.getByTestId('stat-total')).toHaveTextContent('3')
  })

  it('shows/hides add form', async () => {
    const user = userEvent.setup()
    expect(screen.queryByTestId('add-form')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /add leave request/i }))
    expect(screen.getByTestId('add-form')).toBeInTheDocument()
  })

  it('adds a new leave request', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add leave request/i }))
    await user.type(screen.getByLabelText(/employee name/i), 'Eve Stone')
    await user.selectOptions(screen.getByLabelText(/leave type/i), 'Personal')
    await user.type(screen.getByLabelText(/start date/i), '2024-09-01')
    await user.type(screen.getByLabelText(/end date/i), '2024-09-03')
    await user.click(screen.getByRole('button', { name: /submit request/i }))
    expect(screen.getAllByTestId('leave-row')).toHaveLength(5)
    expect(screen.getByTestId('stat-total')).toHaveTextContent('5')
  })

  it('cancel hides form without adding', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add leave request/i }))
    await user.type(screen.getByLabelText(/employee name/i), 'Ghost')
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByTestId('add-form')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('leave-row')).toHaveLength(4)
  })
})
