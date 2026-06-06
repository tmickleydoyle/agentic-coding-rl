import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Food Log App', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /food log/i })).toBeInTheDocument()
  })

  it('shows 4 seed entries', () => {
    render(<App />)
    expect(screen.getAllByTestId('log-entry')).toHaveLength(4)
  })

  it('shows correct seed total calories', () => {
    render(<App />)
    expect(screen.getByTestId('total-calories').textContent).toBe('1140')
  })

  it('shows correct entry count from seed', () => {
    render(<App />)
    expect(screen.getByTestId('entry-count').textContent).toBe('4')
  })

  it('adds a new entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/food name/i))
    await user.type(screen.getByLabelText(/food name/i), 'Apple')
    await user.selectOptions(screen.getByLabelText(/meal/i), 'Snack')
    await user.clear(screen.getByLabelText(/calories/i))
    await user.type(screen.getByLabelText(/calories/i), '95')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('log-entry')).toHaveLength(5)
    expect(screen.getByTestId('entry-count').textContent).toBe('5')
  })

  it('updates total calories after adding entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/food name/i), 'Apple')
    await user.clear(screen.getByLabelText(/calories/i))
    await user.type(screen.getByLabelText(/calories/i), '100')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByTestId('total-calories').textContent).toBe('1240')
  })

  it('clears form after adding entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/food name/i), 'Banana')
    await user.clear(screen.getByLabelText(/calories/i))
    await user.type(screen.getByLabelText(/calories/i), '89')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByLabelText(/food name/i)).toHaveValue('')
    expect(screen.getByLabelText(/calories/i)).toHaveValue(null)
  })

  it('does not add entry with empty food name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/calories/i))
    await user.type(screen.getByLabelText(/calories/i), '200')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('log-entry')).toHaveLength(4)
  })

  it('does not add entry with zero calories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/food name/i), 'Water')
    await user.clear(screen.getByLabelText(/calories/i))
    await user.type(screen.getByLabelText(/calories/i), '0')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('log-entry')).toHaveLength(4)
  })

  it('removes an entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    const removeBtns = screen.getAllByTestId('remove-btn')
    await user.click(removeBtns[0])
    expect(screen.getAllByTestId('log-entry')).toHaveLength(3)
  })

  it('updates total calories after removal', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Remove Oatmeal (300 cal), total should be 1140 - 300 = 840
    await user.click(screen.getAllByTestId('remove-btn')[0])
    expect(screen.getByTestId('total-calories').textContent).toBe('840')
  })

  it('shows meal breakdown', () => {
    render(<App />)
    const breakdown = screen.getByTestId('meal-breakdown')
    expect(breakdown.textContent).toContain('Breakfast')
    expect(breakdown.textContent).toContain('Lunch')
    expect(breakdown.textContent).toContain('Dinner')
  })

  it('shows correct calories in meal breakdown', () => {
    render(<App />)
    // Breakfast: 300+110=410
    expect(screen.getByTestId('meal-breakdown').textContent).toContain('410')
  })
})
