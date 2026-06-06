import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Pantry Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /pantry tracker/i })).toBeTruthy()
  })

  it('shows seed items on load', () => {
    expect(screen.getByTestId('item-card-1')).toBeTruthy()
    expect(screen.getByTestId('item-name-1').textContent).toBe('Rice')
    expect(screen.getByTestId('item-quantity-1').textContent).toBe('2 kg')
    expect(screen.getByTestId('item-category-1').textContent).toBe('Grains')
  })

  it('shows correct summary counts from seed', () => {
    expect(screen.getByTestId('total-items-count').textContent).toBe('5')
    expect(screen.getByTestId('low-stock-count').textContent).toBe('1')
  })

  it('shows low-stock badge for item with quantity < 1', () => {
    expect(screen.getByTestId('low-stock-badge-4')).toBeTruthy()
    expect(screen.getByTestId('low-stock-badge-4').textContent).toBe('Low Stock')
  })

  it('does not show low-stock badge for normal items', () => {
    expect(screen.queryByTestId('low-stock-badge-1')).toBeNull()
  })

  it('adds a new item', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('item-name-input'), 'Sugar')
    await user.type(screen.getByTestId('quantity-input'), '2')
    await user.type(screen.getByTestId('unit-input'), 'kg')
    await user.click(screen.getByTestId('add-item-btn'))
    expect(screen.getByTestId('total-items-count').textContent).toBe('6')
    expect(screen.getByText('Sugar')).toBeTruthy()
  })

  it('does not add item with empty name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('quantity-input'), '1')
    await user.type(screen.getByTestId('unit-input'), 'kg')
    await user.click(screen.getByTestId('add-item-btn'))
    expect(screen.getByTestId('total-items-count').textContent).toBe('5')
  })

  it('auto sets lowStock when adding item with qty 0', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('item-name-input'), 'Salt')
    await user.type(screen.getByTestId('quantity-input'), '0')
    await user.type(screen.getByTestId('unit-input'), 'jar')
    await user.click(screen.getByTestId('add-item-btn'))
    expect(screen.getByTestId('low-stock-count').textContent).toBe('2')
  })

  it('deletes an item', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-item-1'))
    expect(screen.queryByTestId('item-card-1')).toBeNull()
    expect(screen.getByTestId('total-items-count').textContent).toBe('4')
  })

  it('filters to show only low stock items', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-low-stock'))
    expect(screen.getByTestId('item-card-4')).toBeTruthy()
    expect(screen.queryByTestId('item-card-1')).toBeNull()
  })

  it('filter all restores full list', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-low-stock'))
    await user.click(screen.getByTestId('filter-all'))
    expect(screen.getByTestId('item-card-1')).toBeTruthy()
  })

  it('opens qty edit input when Update Qty clicked', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('update-qty-btn-1'))
    expect(screen.getByTestId('qty-edit-input-1')).toBeTruthy()
  })

  it('saves new quantity and updates low stock status', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('update-qty-btn-1'))
    const input = screen.getByTestId('qty-edit-input-1') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '0.5')
    await user.click(screen.getByTestId('save-qty-btn-1'))
    expect(screen.getByTestId('low-stock-badge-1')).toBeTruthy()
    expect(screen.getByTestId('low-stock-count').textContent).toBe('2')
  })

  it('saving qty >= 1 removes low stock badge', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('update-qty-btn-4'))
    const input = screen.getByTestId('qty-edit-input-4') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '2')
    await user.click(screen.getByTestId('save-qty-btn-4'))
    expect(screen.queryByTestId('low-stock-badge-4')).toBeNull()
    expect(screen.getByTestId('low-stock-count').textContent).toBe('0')
  })
})
