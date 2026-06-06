import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Commission Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Commission Tracker' })).toBeTruthy()
  })

  it('shows initial commission count as 4 commissions', () => {
    expect(screen.getByTestId('commission-count').textContent).toBe('4 commissions')
  })

  it('shows total revenue from completed commissions', () => {
    expect(screen.getByTestId('total-revenue').textContent).toBe('Total Earned: $400')
  })

  it('renders all 4 seed commission cards', () => {
    expect(screen.getAllByTestId('commission-card')).toHaveLength(4)
  })

  it('shows correct price for a commission', () => {
    const cards = screen.getAllByTestId('commission-card')
    const aliceCard = cards.find(c => within(c).getByTestId('commission-client').textContent === 'Alice Morgan')!
    expect(within(aliceCard).getByTestId('commission-price').textContent).toBe('$600')
  })

  it('filters commissions by status', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-status'), 'pending')
    expect(screen.getAllByTestId('commission-card')).toHaveLength(2)
  })

  it('shows all commissions when filter is All', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-status'), 'pending')
    await user.selectOptions(screen.getByTestId('filter-status'), 'All')
    expect(screen.getAllByTestId('commission-card')).toHaveLength(4)
  })

  it('updates commission status via status-select', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('commission-card')
    const benCard = cards.find(c => within(c).getByTestId('commission-client').textContent === 'Ben Liu')!
    await user.selectOptions(within(benCard).getByTestId('status-select'), 'completed')
    expect(within(benCard).getByTestId('commission-status').textContent).toBe('completed')
  })

  it('updates total revenue when commission becomes completed', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('commission-card')
    const benCard = cards.find(c => within(c).getByTestId('commission-client').textContent === 'Ben Liu')!
    await user.selectOptions(within(benCard).getByTestId('status-select'), 'completed')
    expect(screen.getByTestId('total-revenue').textContent).toBe('Total Earned: $650')
  })

  it('deletes a commission and updates count', async () => {
    const user = userEvent.setup()
    await user.click(within(screen.getAllByTestId('commission-card')[0]).getByTestId('delete-commission'))
    expect(screen.getAllByTestId('commission-card')).toHaveLength(3)
    expect(screen.getByTestId('commission-count').textContent).toBe('3 commissions')
  })

  it('adds a valid new commission', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-client'), 'Eve Tran')
    await user.type(screen.getByTestId('input-description'), 'Mural design')
    await user.type(screen.getByTestId('input-price'), '500')
    await user.click(screen.getByTestId('submit-commission'))
    expect(screen.getAllByTestId('commission-card')).toHaveLength(5)
    expect(screen.getByTestId('commission-count').textContent).toBe('5 commissions')
  })

  it('shows form error when price is invalid', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-client'), 'Test Client')
    await user.type(screen.getByTestId('input-description'), 'Test work')
    await user.type(screen.getByTestId('input-price'), '-10')
    await user.click(screen.getByTestId('submit-commission'))
    expect(screen.getByTestId('form-error').textContent).toBe('Please provide client, description, and a valid price.')
  })

  it('shows form error when client is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-description'), 'Some work')
    await user.type(screen.getByTestId('input-price'), '100')
    await user.click(screen.getByTestId('submit-commission'))
    expect(screen.getByTestId('form-error')).toBeTruthy()
  })

  it('commission-count reflects total not filtered count', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-status'), 'completed')
    expect(screen.getByTestId('commission-count').textContent).toBe('4 commissions')
  })
})
