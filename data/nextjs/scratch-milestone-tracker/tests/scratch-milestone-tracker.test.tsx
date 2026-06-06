import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Milestone Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /milestone tracker/i })).toBeTruthy()
  })

  it('renders 4 seed milestones on load', () => {
    expect(screen.getAllByTestId('milestone-card')).toHaveLength(4)
  })

  it('shows correct stats on load (2 of 4 completed)', () => {
    expect(screen.getByTestId('stats').textContent).toContain('2')
    expect(screen.getByTestId('stats').textContent).toContain('4')
  })

  it('renders completed milestones with completed-title testid', () => {
    const completedTitles = screen.getAllByTestId('completed-title')
    expect(completedTitles).toHaveLength(2)
  })

  it('renders checkboxes for all milestones', () => {
    const checkboxes = screen.getAllByTestId('complete-checkbox')
    expect(checkboxes).toHaveLength(4)
  })

  it('toggles a milestone to completed when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const checkboxes = screen.getAllByTestId('complete-checkbox') as HTMLInputElement[]
    const unchecked = checkboxes.find(cb => !cb.checked)
    expect(unchecked).toBeTruthy()
    await user.click(unchecked!)
    expect(screen.getByTestId('stats').textContent).toContain('3')
  })

  it('toggles a milestone back to incomplete', async () => {
    const user = userEvent.setup()
    const checkboxes = screen.getAllByTestId('complete-checkbox') as HTMLInputElement[]
    const checked = checkboxes.find(cb => cb.checked)
    expect(checked).toBeTruthy()
    await user.click(checked!)
    expect(screen.getByTestId('stats').textContent).toContain('1')
  })

  it('adds a new milestone with valid data', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Learn Spanish')
    fireEvent.change(screen.getByTestId('input-target-date'), { target: { value: '2025-06-30' } })
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('milestone-card')).toHaveLength(5)
    expect(screen.getByText('Learn Spanish')).toBeTruthy()
  })

  it('new milestone defaults to not completed', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'New Goal')
    fireEvent.change(screen.getByTestId('input-target-date'), { target: { value: '2025-06-30' } })
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('stats').textContent).toContain('2 / 5')
  })

  it('shows validation error when title is missing', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('input-target-date'), { target: { value: '2025-01-01' } })
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error').textContent).toContain('Title and target date are required')
  })

  it('filters to show only completed milestones', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-completed'))
    expect(screen.getAllByTestId('milestone-card')).toHaveLength(2)
  })

  it('filters to show only in-progress milestones', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-progress'))
    expect(screen.getAllByTestId('milestone-card')).toHaveLength(2)
  })

  it('stats remain unfiltered when a filter is active', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-completed'))
    expect(screen.getByTestId('stats').textContent).toContain('4')
  })

  it('shows empty state when no milestones match filter', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('delete-btn')[0])
    await user.click(screen.getAllByTestId('delete-btn')[0])
    await user.click(screen.getAllByTestId('delete-btn')[0])
    await user.click(screen.getAllByTestId('delete-btn')[0])
    expect(screen.getByTestId('empty-state')).toBeTruthy()
  })

  it('deletes a milestone', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('delete-btn')[0])
    expect(screen.getAllByTestId('milestone-card')).toHaveLength(3)
  })
})
