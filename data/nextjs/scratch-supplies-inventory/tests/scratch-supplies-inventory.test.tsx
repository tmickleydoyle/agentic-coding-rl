import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Supplies Inventory', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Supplies Inventory' })).toBeTruthy()
  })

  it('shows correct initial low-stock count', () => {
    // Cadmium Red (1 <= 3) and Linen Canvas (2 <= 5) are low stock
    expect(screen.getByTestId('low-stock-count').textContent).toBe('2 low stock')
  })

  it('renders all 5 seed supply cards', () => {
    expect(screen.getAllByTestId('supply-card')).toHaveLength(5)
  })

  it('shows correct quantity with unit', () => {
    const cards = screen.getAllByTestId('supply-card')
    const whiteCard = cards.find(c => within(c).getByTestId('supply-name').textContent === 'Titanium White')!
    expect(within(whiteCard).getByTestId('supply-quantity').textContent).toBe('3 tubes')
  })

  it('shows Low Stock for items at or below reorderAt', () => {
    const cards = screen.getAllByTestId('supply-card')
    const redCard = cards.find(c => within(c).getByTestId('supply-name').textContent === 'Cadmium Red')!
    expect(within(redCard).getByTestId('supply-status').textContent).toBe('Low Stock')
  })

  it('shows OK for items above reorderAt', () => {
    const cards = screen.getAllByTestId('supply-card')
    const brushCard = cards.find(c => within(c).getByTestId('supply-name').textContent === 'Flat Brush Set')!
    expect(within(brushCard).getByTestId('supply-status').textContent).toBe('OK')
  })

  it('increments quantity', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('supply-card')
    const whiteCard = cards.find(c => within(c).getByTestId('supply-name').textContent === 'Titanium White')!
    await user.click(within(whiteCard).getByTestId('increment-qty'))
    expect(within(whiteCard).getByTestId('supply-quantity').textContent).toBe('4 tubes')
  })

  it('decrements quantity', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('supply-card')
    const brushCard = cards.find(c => within(c).getByTestId('supply-name').textContent === 'Flat Brush Set')!
    await user.click(within(brushCard).getByTestId('decrement-qty'))
    expect(within(brushCard).getByTestId('supply-quantity').textContent).toBe('7 pieces')
  })

  it('does not decrement below 0', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('supply-card')
    const redCard = cards.find(c => within(c).getByTestId('supply-name').textContent === 'Cadmium Red')!
    await user.click(within(redCard).getByTestId('decrement-qty'))
    expect(within(redCard).getByTestId('supply-quantity').textContent).toBe('0 tubes')
    await user.click(within(redCard).getByTestId('decrement-qty'))
    expect(within(redCard).getByTestId('supply-quantity').textContent).toBe('0 tubes')
  })

  it('filters supplies by name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'brush')
    expect(screen.getAllByTestId('supply-card')).toHaveLength(1)
  })

  it('filters supplies by category', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-category'), 'Paint')
    expect(screen.getAllByTestId('supply-card')).toHaveLength(2)
  })

  it('deletes a supply', async () => {
    const user = userEvent.setup()
    await user.click(within(screen.getAllByTestId('supply-card')[0]).getByTestId('delete-supply'))
    expect(screen.getAllByTestId('supply-card')).toHaveLength(4)
  })

  it('adds a valid new supply', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-name'), 'Burnt Sienna')
    await user.type(screen.getByTestId('input-category'), 'Paint')
    await user.type(screen.getByTestId('input-quantity'), '5')
    await user.type(screen.getByTestId('input-reorder-at'), '2')
    await user.type(screen.getByTestId('input-unit'), 'tubes')
    await user.click(screen.getByTestId('submit-supply'))
    expect(screen.getAllByTestId('supply-card')).toHaveLength(6)
  })

  it('shows form error when name is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-category'), 'Paint')
    await user.type(screen.getByTestId('input-quantity'), '5')
    await user.type(screen.getByTestId('input-reorder-at'), '2')
    await user.click(screen.getByTestId('submit-supply'))
    expect(screen.getByTestId('form-error').textContent).toBe('Please fill in all fields with valid values.')
  })

  it('low-stock-count updates after increment resolves low stock', async () => {
    const user = userEvent.setup()
    // Cadmium Red qty=1, reorderAt=3, still low after +1=2
    const cards = screen.getAllByTestId('supply-card')
    const canvasCard = cards.find(c => within(c).getByTestId('supply-name').textContent === 'Linen Canvas 12x16')!
    // increment canvas from 2 to above 5 reorderAt requires many clicks — instead just verify count changes
    await user.click(within(canvasCard).getByTestId('increment-qty'))
    await user.click(within(canvasCard).getByTestId('increment-qty'))
    await user.click(within(canvasCard).getByTestId('increment-qty'))
    await user.click(within(canvasCard).getByTestId('increment-qty'))
    // now 6 > 5 reorderAt, still Cadmium Red is low
    expect(screen.getByTestId('low-stock-count').textContent).toBe('1 low stock')
  })
})
