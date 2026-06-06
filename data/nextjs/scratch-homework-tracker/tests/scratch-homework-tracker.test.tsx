import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Homework Tracker', () => {
  beforeEach(() => render(<App />))

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /homework tracker/i })).toBeInTheDocument()
  })

  it('shows all 6 seed assignments by default', () => {
    expect(screen.getAllByTestId('assignment-item')).toHaveLength(6)
  })

  it('shows correct total count', () => {
    expect(screen.getByTestId('total-count').textContent).toBe('6')
  })

  it('shows correct pending count', () => {
    expect(screen.getByTestId('pending-count').textContent).toBe('3')
  })

  it('shows correct completed count', () => {
    expect(screen.getByTestId('completed-count').textContent).toBe('3')
  })

  it('filters to show only pending assignments', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'Pending')
    expect(screen.getAllByTestId('assignment-item')).toHaveLength(3)
  })

  it('filters to show only completed assignments', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'Completed')
    expect(screen.getAllByTestId('assignment-item')).toHaveLength(3)
  })

  it('filters by subject Math', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by subject/i), 'Math')
    const items = screen.getAllByTestId('assignment-item')
    expect(items).toHaveLength(2)
    items.forEach(item => {
      expect(within(item).getByTestId('assignment-subject').textContent).toBe('Math')
    })
  })

  it('combines status and subject filters', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'Pending')
    await user.selectOptions(screen.getByLabelText(/filter by subject/i), 'Math')
    expect(screen.getAllByTestId('assignment-item')).toHaveLength(1)
    expect(screen.getByTestId('assignment-title').textContent).toBe('Geometry Quiz Prep')
  })

  it('toggles an assignment from pending to completed', async () => {
    const user = userEvent.setup()
    const checkbox = screen.getByRole('checkbox', { name: /lab report draft/i })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(screen.getByTestId('completed-count').textContent).toBe('4')
  })

  it('updates summary counts when toggling', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('checkbox', { name: /chapter 5 reading/i }))
    expect(screen.getByTestId('pending-count').textContent).toBe('2')
    expect(screen.getByTestId('completed-count').textContent).toBe('4')
  })

  it('adds a new assignment', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^title$/i), 'New HW')
    await user.type(screen.getByLabelText(/^subject$/i), 'Art')
    await user.click(screen.getByRole('button', { name: /add assignment/i }))
    expect(screen.getByTestId('total-count').textContent).toBe('7')
    expect(screen.getByText('New HW')).toBeInTheDocument()
  })

  it('new assignment is pending by default', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^title$/i), 'Test Task')
    await user.type(screen.getByLabelText(/^subject$/i), 'PE')
    await user.click(screen.getByRole('button', { name: /add assignment/i }))
    const items = screen.getAllByTestId('assignment-item')
    const newItem = items.find(item => within(item).queryByText('Test Task'))!
    expect(within(newItem).getByTestId('assignment-status').textContent).toBe('Pending')
  })

  it('does not add assignment with empty title', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^subject$/i), 'Math')
    await user.click(screen.getByRole('button', { name: /add assignment/i }))
    expect(screen.getByTestId('total-count').textContent).toBe('6')
  })
})
