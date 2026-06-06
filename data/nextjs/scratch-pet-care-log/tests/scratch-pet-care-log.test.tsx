import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Pet Care Log', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Pet Care Log')).toBeInTheDocument()
  })

  it('shows pet name', () => {
    expect(screen.getByTestId('pet-name').textContent).toBe('Buddy (Dog)')
  })

  it('shows 5 seed entries', () => {
    expect(screen.getAllByTestId('care-entry')).toHaveLength(5)
  })

  it('shows entry count of 5', () => {
    expect(screen.getByTestId('entry-count').textContent).toBe('5 entries')
  })

  it('shows feeding count of 3 from seed', () => {
    expect(screen.getByTestId('feeding-count').textContent).toBe('Total feedings: 3')
  })

  it('seed entries show date, type, and note', () => {
    const entries = screen.getAllByTestId('care-entry')
    expect(entries[0].textContent).toContain('2024-04-01')
    expect(entries[0].textContent).toContain('Feeding')
    expect(entries[0].textContent).toContain('Morning kibble')
  })

  it('logs a new activity', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Date$/i), '2024-04-04')
    await user.selectOptions(screen.getByLabelText(/activity type/i), 'Walk')
    await user.type(screen.getByLabelText(/^Note$/i), 'Evening stroll')
    await user.click(screen.getByRole('button', { name: /log activity/i }))
    expect(screen.getAllByTestId('care-entry')).toHaveLength(6)
  })

  it('does not log when date missing', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /log activity/i }))
    expect(screen.getAllByTestId('care-entry')).toHaveLength(5)
  })

  it('increments feeding count when feeding logged', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Date$/i), '2024-04-04')
    await user.selectOptions(screen.getByLabelText(/activity type/i), 'Feeding')
    await user.click(screen.getByRole('button', { name: /log activity/i }))
    expect(screen.getByTestId('feeding-count').textContent).toBe('Total feedings: 4')
  })

  it('does not change feeding count for non-feeding activity', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Date$/i), '2024-04-04')
    await user.selectOptions(screen.getByLabelText(/activity type/i), 'Play')
    await user.click(screen.getByRole('button', { name: /log activity/i }))
    expect(screen.getByTestId('feeding-count').textContent).toBe('Total feedings: 3')
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    const deleteBtns = screen.getAllByTestId('delete-entry')
    await user.click(deleteBtns[0])
    expect(screen.getAllByTestId('care-entry')).toHaveLength(4)
  })

  it('deleting a feeding entry decreases feeding count', async () => {
    const user = userEvent.setup()
    // First entry is a feeding entry
    const deleteBtns = screen.getAllByTestId('delete-entry')
    await user.click(deleteBtns[0])
    expect(screen.getByTestId('feeding-count').textContent).toBe('Total feedings: 2')
  })

  it('filters entries by type', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by type/i), 'Feeding')
    expect(screen.getAllByTestId('care-entry')).toHaveLength(3)
    expect(screen.getByTestId('entry-count').textContent).toBe('3 entries')
  })

  it('feeding-count unchanged by filter', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by type/i), 'Walk')
    expect(screen.getByTestId('feeding-count').textContent).toBe('Total feedings: 3')
  })
})
