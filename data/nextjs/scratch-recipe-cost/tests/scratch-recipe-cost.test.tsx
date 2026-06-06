import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Recipe Cost Calculator', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /recipe cost calculator/i })).toBeTruthy()
  })

  it('shows seed recipe name and servings', () => {
    expect((screen.getByTestId('recipe-name-input') as HTMLInputElement).value).toBe('Spaghetti Carbonara')
    expect((screen.getByTestId('servings-input') as HTMLInputElement).value).toBe('4')
  })

  it('shows correct ingredient count from seed', () => {
    expect(screen.getByTestId('ingredient-count').textContent).toBe('5')
  })

  it('shows seed ingredient rows', () => {
    expect(screen.getByTestId('ingredient-row-1')).toBeTruthy()
    expect(screen.getByTestId('ingredient-name-1').textContent).toBe('Spaghetti')
    expect(screen.getByTestId('ingredient-amount-1').textContent).toBe('400 g')
  })

  it('calculates line cost for seed ingredients', () => {
    // Spaghetti: 400 * 0.005 = 2.00
    expect(screen.getByTestId('ingredient-cost-1').textContent).toBe('2.00')
    // Eggs: 4 * 0.30 = 1.20
    expect(screen.getByTestId('ingredient-cost-2').textContent).toBe('1.20')
  })

  it('calculates total cost from seed data', () => {
    // 2.00 + 1.20 + 6.00 + 6.00 + 0.10 = 15.30
    const total = parseFloat(screen.getByTestId('total-cost').textContent || '0')
    expect(total).toBeCloseTo(15.3, 1)
  })

  it('calculates cost per serving', () => {
    const perServing = parseFloat(screen.getByTestId('cost-per-serving').textContent || '0')
    expect(perServing).toBeCloseTo(15.3 / 4, 1)
  })

  it('updates cost per serving when servings changes', async () => {
    const user = userEvent.setup()
    const input = screen.getByTestId('servings-input') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '2')
    const perServing = parseFloat(screen.getByTestId('cost-per-serving').textContent || '0')
    const total = parseFloat(screen.getByTestId('total-cost').textContent || '0')
    expect(perServing).toBeCloseTo(total / 2, 1)
  })

  it('adds a new ingredient', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('ingredient-name-input'), 'Salt')
    await user.type(screen.getByTestId('amount-input'), '10')
    await user.type(screen.getByTestId('unit-input'), 'g')
    await user.type(screen.getByTestId('price-per-unit-input'), '0.01')
    await user.click(screen.getByTestId('add-ingredient-btn'))
    expect(screen.getByTestId('ingredient-count').textContent).toBe('6')
    expect(screen.getByText('Salt')).toBeTruthy()
  })

  it('resets ingredient form after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('ingredient-name-input'), 'Pepper')
    await user.type(screen.getByTestId('amount-input'), '5')
    await user.type(screen.getByTestId('price-per-unit-input'), '0.02')
    await user.click(screen.getByTestId('add-ingredient-btn'))
    expect((screen.getByTestId('ingredient-name-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('amount-input') as HTMLInputElement).value).toBe('')
  })

  it('does not add ingredient with empty name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('amount-input'), '100')
    await user.click(screen.getByTestId('add-ingredient-btn'))
    expect(screen.getByTestId('ingredient-count').textContent).toBe('5')
  })

  it('deletes an ingredient and updates totals', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-ingredient-1'))
    expect(screen.queryByTestId('ingredient-row-1')).toBeNull()
    expect(screen.getByTestId('ingredient-count').textContent).toBe('4')
    const newTotal = parseFloat(screen.getByTestId('total-cost').textContent || '0')
    expect(newTotal).toBeCloseTo(15.3 - 2.0, 1)
  })

  it('shows 0.00 total when all ingredients deleted', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-ingredient-1'))
    await user.click(screen.getByTestId('delete-ingredient-2'))
    await user.click(screen.getByTestId('delete-ingredient-3'))
    await user.click(screen.getByTestId('delete-ingredient-4'))
    await user.click(screen.getByTestId('delete-ingredient-5'))
    expect(screen.getByTestId('total-cost').textContent).toBe('0.00')
    expect(screen.getByTestId('cost-per-serving').textContent).toBe('0.00')
  })
})
