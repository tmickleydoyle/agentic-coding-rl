import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Grocery List', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /grocery list/i })).toBeTruthy()
  })

  it('shows seed items on load', () => {
    expect(screen.getByTestId('item-card-1')).toBeTruthy()
    expect(screen.getByTestId('item-name-1').textContent).toBe('Milk')
    expect(screen.getByTestId('item-quantity-1').textContent).toBe('2 liters')
    expect(screen.getByTestId('item-category-1').textContent).toBe('Dairy')
  })

  it('shows correct summary counts from seed', () => {
    expect(screen.getByTestId('total-items-count').textContent).toBe('5')
    expect(screen.getByTestId('remaining-count').textContent).toBe('4')
  })

  it('adds a new item', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('item-name-input'), 'Butter')
    await user.type(screen.getByTestId('quantity-input'), '250')
    await user.type(screen.getByTestId('unit-input'), 'grams')
    await user.click(screen.getByTestId('add-item-btn'))
    expect(screen.getByTestId('total-items-count').textContent).toBe('6')
    expect(screen.getByText('Butter')).toBeTruthy()
  })

  it('resets name/quantity/unit after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('item-name-input'), 'Eggs')
    await user.type(screen.getByTestId('quantity-input'), '12')
    await user.type(screen.getByTestId('unit-input'), 'pcs')
    await user.click(screen.getByTestId('add-item-btn'))
    expect((screen.getByTestId('item-name-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('quantity-input') as HTMLInputElement).value).toBe('')
  })

  it('does not add item with empty name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('quantity-input'), '5')
    await user.click(screen.getByTestId('add-item-btn'))
    expect(screen.getByTestId('total-items-count').textContent).toBe('5')
  })

  it('does not add item with quantity 0', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('item-name-input'), 'Salt')
    await user.type(screen.getByTestId('quantity-input'), '0')
    await user.click(screen.getByTestId('add-item-btn'))
    expect(screen.getByTestId('total-items-count').textContent).toBe('5')
  })

  it('toggles purchased and updates remaining count', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('item-checkbox-1'))
    expect(screen.getByTestId('remaining-count').textContent).toBe('3')
  })

  it('applies line-through to purchased items', () => {
    expect(screen.getByTestId('item-name-3').className).toContain('line-through')
  })

  it('deletes an item', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-item-2'))
    expect(screen.queryByTestId('item-card-2')).toBeNull()
    expect(screen.getByTestId('total-items-count').textContent).toBe('4')
  })

  it('clears purchased items', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('clear-purchased-btn'))
    expect(screen.queryByTestId('item-card-3')).toBeNull()
    expect(screen.getByTestId('total-items-count').textContent).toBe('4')
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-dairy'))
    expect(screen.getByTestId('item-card-1')).toBeTruthy()
    expect(screen.queryByTestId('item-card-2')).toBeNull()
  })

  it('summary counts unaffected by filter', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-meat'))
    expect(screen.getByTestId('total-items-count').textContent).toBe('5')
    expect(screen.getByTestId('remaining-count').textContent).toBe('4')
  })

  it('defaults unit to pcs when empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('item-name-input'), 'Lemons')
    await user.type(screen.getByTestId('quantity-input'), '3')
    await user.click(screen.getByTestId('add-item-btn'))
    expect(screen.getByText('3 pcs')).toBeTruthy()
  })
})
