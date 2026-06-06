import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Gig Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Gig Tracker')).toBeTruthy()
  })

  it('shows 5 total gigs initially', () => {
    expect(screen.getByTestId('stat-total-gigs').textContent).toBe('5')
  })

  it('shows gig items', () => {
    expect(screen.getByTestId('gig-item-1')).toBeTruthy()
    expect(screen.getByTestId('gig-item-5')).toBeTruthy()
  })

  it('shows pay formatted with dollar sign', () => {
    expect(within(screen.getByTestId('gig-item-1')).getByTestId('gig-pay-1').textContent).toBe('$150')
  })

  it('shows total earnings from completed gigs', () => {
    // completed: gig1 ($150) + gig3 ($80) = $230
    expect(screen.getByTestId('stat-total-earnings').textContent).toBe('$230')
  })

  it('shows upcoming gig count', () => {
    // confirmed: gig2, gig5; pending: gig4 = 3
    expect(screen.getByTestId('stat-upcoming').textContent).toBe('3')
  })

  it('filters by status', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-status'), 'completed')
    expect(screen.getByTestId('gig-item-1')).toBeTruthy()
    expect(screen.getByTestId('gig-item-3')).toBeTruthy()
    expect(screen.queryByTestId('gig-item-2')).toBeNull()
  })

  it('updates gig status via select', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('status-select-4'), 'completed')
    // Now completed: gig1+gig3+gig4 = 150+80+300 = 530
    expect(screen.getByTestId('stat-total-earnings').textContent).toBe('$530')
  })

  it('cancelling a gig removes it from upcoming count', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('status-select-2'), 'cancelled')
    expect(screen.getByTestId('stat-upcoming').textContent).toBe('2')
  })

  it('deletes a gig', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    expect(screen.queryByTestId('gig-item-1')).toBeNull()
    expect(screen.getByTestId('stat-total-gigs').textContent).toBe('4')
  })

  it('adds a new gig', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-venue'), 'Jazz Club')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-04-15' } })
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('stat-total-gigs').textContent).toBe('6')
  })

  it('does not add gig with empty venue', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-04-15' } })
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('stat-total-gigs').textContent).toBe('5')
  })

  it('does not add gig with empty date', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-venue'), 'Some Venue')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('stat-total-gigs').textContent).toBe('5')
  })

  it('stats unaffected by filter', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-status'), 'pending')
    expect(screen.getByTestId('stat-total-gigs').textContent).toBe('5')
    expect(screen.getByTestId('stat-total-earnings').textContent).toBe('$230')
  })
})
