import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Recipe Finder', () => {
  beforeEach(() => render(<App />))

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /recipe finder/i })).toBeInTheDocument()
  })

  it('shows 6 seed recipes', () => {
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(6)
  })

  it('shows recipe count = 6', () => {
    expect(screen.getByTestId('recipe-count').textContent).toContain('6')
  })

  it('filters by search term', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search recipes/i), 'salad')
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(1)
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument()
  })

  it('filters by category Breakfast', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Breakfast')
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(2)
  })

  it('filters by category Dinner', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Dinner')
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(2)
  })

  it('shows no-results when no match', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search recipes/i), 'zzznomatch')
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
    expect(screen.queryAllByTestId('recipe-card')).toHaveLength(0)
  })

  it('applies search and category together', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Lunch')
    await user.type(screen.getByLabelText(/search recipes/i), 'soup')
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(1)
    expect(screen.getByText('Tomato Soup')).toBeInTheDocument()
  })

  it('shows recipe category badge', () => {
    const cats = screen.getAllByTestId('recipe-category')
    expect(cats.length).toBeGreaterThan(0)
  })

  it('shows recipe time', () => {
    const times = screen.getAllByTestId('recipe-time')
    expect(times[0].textContent).toMatch(/\d+ min/)
  })

  it('adds a new recipe', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/recipe name/i), 'Omelette')
    await user.selectOptions(screen.getByLabelText(/^category$/i), 'Breakfast')
    await user.type(screen.getByLabelText(/cook time/i), '10')
    await user.type(screen.getByLabelText(/ingredients count/i), '3')
    await user.click(screen.getByRole('button', { name: /add recipe/i }))
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(7)
    expect(screen.getByText('Omelette')).toBeInTheDocument()
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    const nameInput = screen.getByLabelText(/recipe name/i)
    await user.type(nameInput, 'Omelette')
    await user.type(screen.getByLabelText(/cook time/i), '10')
    await user.type(screen.getByLabelText(/ingredients count/i), '3')
    await user.click(screen.getByRole('button', { name: /add recipe/i }))
    expect(nameInput).toHaveValue('')
  })

  it('does not add recipe with empty name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/cook time/i), '10')
    await user.type(screen.getByLabelText(/ingredients count/i), '3')
    await user.click(screen.getByRole('button', { name: /add recipe/i }))
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(6)
  })
})
