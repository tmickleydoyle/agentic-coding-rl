import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Weekly Meal Planner', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /weekly meal planner/i })).toBeTruthy()
  })

  it('shows seed meals on load', () => {
    expect(screen.getByTestId('meal-card-1')).toBeTruthy()
    expect(screen.getByTestId('meal-name-1').textContent).toBe('Oatmeal')
    expect(screen.getByTestId('meal-day-1').textContent).toBe('Monday')
    expect(screen.getByTestId('meal-type-1').textContent).toBe('breakfast')
  })

  it('shows total and completed counts from seed data', () => {
    expect(screen.getByTestId('total-count').textContent).toBe('5')
    expect(screen.getByTestId('completed-count').textContent).toBe('1')
  })

  it('adds a new meal', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('meal-name-input'), 'Pancakes')
    await user.click(screen.getByTestId('add-meal-btn'))
    expect(screen.getByTestId('total-count').textContent).toBe('6')
    expect(screen.getByText('Pancakes')).toBeTruthy()
  })

  it('clears meal name input after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('meal-name-input'), 'Waffles')
    await user.click(screen.getByTestId('add-meal-btn'))
    expect((screen.getByTestId('meal-name-input') as HTMLInputElement).value).toBe('')
  })

  it('does not add a meal with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-meal-btn'))
    expect(screen.getByTestId('total-count').textContent).toBe('5')
  })

  it('does not add a meal with whitespace-only name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('meal-name-input'), '   ')
    await user.click(screen.getByTestId('add-meal-btn'))
    expect(screen.getByTestId('total-count').textContent).toBe('5')
  })

  it('deletes a meal', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-meal-1'))
    expect(screen.queryByTestId('meal-card-1')).toBeNull()
    expect(screen.getByTestId('total-count').textContent).toBe('4')
  })

  it('toggles completed state and updates completed count', async () => {
    const user = userEvent.setup()
    expect(screen.getByTestId('completed-count').textContent).toBe('1')
    await user.click(screen.getByTestId('meal-checkbox-1'))
    expect(screen.getByTestId('completed-count').textContent).toBe('2')
    await user.click(screen.getByTestId('meal-checkbox-1'))
    expect(screen.getByTestId('completed-count').textContent).toBe('1')
  })

  it('applies line-through class to completed meals', () => {
    const nameEl = screen.getByTestId('meal-name-3')
    expect(nameEl.className).toContain('line-through')
  })

  it('filters by breakfast', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-breakfast'))
    expect(screen.getByTestId('meal-card-1')).toBeTruthy()
    expect(screen.queryByTestId('meal-card-4')).toBeNull()
  })

  it('filter all restores full list', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-dinner'))
    await user.click(screen.getByTestId('filter-all'))
    expect(screen.getByTestId('meal-card-1')).toBeTruthy()
    expect(screen.getByTestId('meal-card-4')).toBeTruthy()
  })

  it('summary counts reflect full dataset regardless of filter', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-dinner'))
    expect(screen.getByTestId('total-count').textContent).toBe('5')
  })

  it('shows meal day and type in card', () => {
    expect(screen.getByTestId('meal-day-2').textContent).toBe('Monday')
    expect(screen.getByTestId('meal-type-2').textContent).toBe('lunch')
  })
})
