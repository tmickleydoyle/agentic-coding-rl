import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Nutrition Log', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /nutrition log/i })).toBeTruthy()
  })

  it('shows seed entries on load', () => {
    expect(screen.getByTestId('entry-card-1')).toBeTruthy()
    expect(screen.getByTestId('entry-meal-1').textContent).toBe('Oatmeal with Berries')
    expect(screen.getByTestId('entry-calories-1').textContent).toBe('320')
    expect(screen.getByTestId('entry-type-1').textContent).toBe('breakfast')
  })

  it('shows correct daily totals from seed data', () => {
    expect(screen.getByTestId('total-calories').textContent).toBe('1470')
    expect(screen.getByTestId('total-protein').textContent).toBe('105')
    expect(screen.getByTestId('total-carbs').textContent).toBe('140')
    expect(screen.getByTestId('total-fat').textContent).toBe('45')
  })

  it('shows goal progress', () => {
    expect(screen.getByTestId('calories-progress').textContent).toBe('1470 / 2000')
    expect(screen.getByTestId('protein-progress').textContent).toBe('105 / 150')
    expect(screen.getByTestId('carbs-progress').textContent).toBe('140 / 250')
    expect(screen.getByTestId('fat-progress').textContent).toBe('45 / 65')
  })

  it('adds a new entry', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('meal-name-input'), 'Protein Bar')
    await user.type(screen.getByTestId('calories-input'), '200')
    await user.type(screen.getByTestId('protein-input'), '20')
    await user.type(screen.getByTestId('carbs-input'), '25')
    await user.type(screen.getByTestId('fat-input'), '5')
    await user.click(screen.getByTestId('log-meal-btn'))
    expect(screen.getByText('Protein Bar')).toBeTruthy()
    expect(screen.getByTestId('total-calories').textContent).toBe('1670')
  })

  it('resets form after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('meal-name-input'), 'Apple')
    await user.type(screen.getByTestId('calories-input'), '80')
    await user.type(screen.getByTestId('protein-input'), '0')
    await user.type(screen.getByTestId('carbs-input'), '21')
    await user.type(screen.getByTestId('fat-input'), '0')
    await user.click(screen.getByTestId('log-meal-btn'))
    expect((screen.getByTestId('meal-name-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('calories-input') as HTMLInputElement).value).toBe('')
  })

  it('does not add entry with empty meal name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('calories-input'), '100')
    await user.click(screen.getByTestId('log-meal-btn'))
    expect(screen.getByTestId('total-calories').textContent).toBe('1470')
  })

  it('does not add entry with negative calories', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('meal-name-input'), 'Bad Entry')
    await user.type(screen.getByTestId('calories-input'), '-100')
    await user.type(screen.getByTestId('protein-input'), '10')
    await user.type(screen.getByTestId('carbs-input'), '10')
    await user.type(screen.getByTestId('fat-input'), '5')
    await user.click(screen.getByTestId('log-meal-btn'))
    expect(screen.getByTestId('total-calories').textContent).toBe('1470')
  })

  it('deletes an entry and updates totals', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-entry-1'))
    expect(screen.queryByTestId('entry-card-1')).toBeNull()
    expect(screen.getByTestId('total-calories').textContent).toBe('1150')
  })

  it('filters by meal type', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-breakfast'))
    expect(screen.getByTestId('entry-card-1')).toBeTruthy()
    expect(screen.queryByTestId('entry-card-2')).toBeNull()
  })

  it('filter all restores full list', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-snack'))
    await user.click(screen.getByTestId('filter-all'))
    expect(screen.getByTestId('entry-card-1')).toBeTruthy()
    expect(screen.getByTestId('entry-card-4')).toBeTruthy()
  })

  it('totals always reflect full dataset regardless of filter', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-snack'))
    expect(screen.getByTestId('total-calories').textContent).toBe('1470')
  })

  it('shows macro details in each entry card', () => {
    expect(screen.getByTestId('entry-protein-2').textContent).toBe('38')
    expect(screen.getByTestId('entry-carbs-2').textContent).toBe('42')
    expect(screen.getByTestId('entry-fat-2').textContent).toBe('14')
  })
})
