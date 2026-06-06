import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Art Portfolio', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Art Portfolio' })).toBeTruthy()
  })

  it('shows initial artwork count as 4 works', () => {
    expect(screen.getByTestId('artwork-count').textContent).toBe('4 works')
  })

  it('renders all 4 seed artwork cards', () => {
    expect(screen.getAllByTestId('artwork-card')).toHaveLength(4)
  })

  it('shows correct price for artworks for sale', () => {
    const cards = screen.getAllByTestId('artwork-card')
    const sunsetCard = cards.find(c => within(c).getByTestId('artwork-title').textContent === 'Sunset Over Hills')!
    expect(within(sunsetCard).getByTestId('artwork-price').textContent).toBe('$450')
  })

  it('shows Not for Sale for artworks not for sale', () => {
    const cards = screen.getAllByTestId('artwork-card')
    const urbanCard = cards.find(c => within(c).getByTestId('artwork-title').textContent === 'Urban Fragments')!
    expect(within(urbanCard).getByTestId('artwork-price').textContent).toBe('Not for Sale')
  })

  it('filters artworks by title text', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'silent')
    const cards = screen.getAllByTestId('artwork-card')
    expect(cards).toHaveLength(1)
    expect(within(cards[0]).getByTestId('artwork-title').textContent).toBe('Silent Forest')
  })

  it('filters artworks by for sale checkbox', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-for-sale'))
    const cards = screen.getAllByTestId('artwork-card')
    expect(cards).toHaveLength(2)
  })

  it('toggles an artwork from for sale to not for sale', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('artwork-card')
    const sunsetCard = cards.find(c => within(c).getByTestId('artwork-title').textContent === 'Sunset Over Hills')!
    const btn = within(sunsetCard).getByTestId('toggle-sale')
    expect(btn.textContent).toBe('Remove from Sale')
    await user.click(btn)
    expect(within(sunsetCard).getByTestId('artwork-price').textContent).toBe('Not for Sale')
  })

  it('deletes an artwork and updates count', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('artwork-card')
    const firstCard = cards[0]
    await user.click(within(firstCard).getByTestId('delete-artwork'))
    expect(screen.getAllByTestId('artwork-card')).toHaveLength(3)
    expect(screen.getByTestId('artwork-count').textContent).toBe('3 works')
  })

  it('adds a valid new artwork and updates count', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'New Piece')
    await user.type(screen.getByTestId('input-medium'), 'Gouache')
    await user.type(screen.getByTestId('input-year'), '2024')
    await user.click(screen.getByTestId('submit-artwork'))
    expect(screen.getAllByTestId('artwork-card')).toHaveLength(5)
    expect(screen.getByTestId('artwork-count').textContent).toBe('5 works')
  })

  it('shows form error on invalid submission (empty title)', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-medium'), 'Gouache')
    await user.type(screen.getByTestId('input-year'), '2024')
    await user.click(screen.getByTestId('submit-artwork'))
    expect(screen.getByTestId('form-error').textContent).toBe('Please fill in all required fields correctly.')
  })

  it('shows form error on invalid year', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Test')
    await user.type(screen.getByTestId('input-medium'), 'Oil')
    await user.type(screen.getByTestId('input-year'), '1800')
    await user.click(screen.getByTestId('submit-artwork'))
    expect(screen.getByTestId('form-error')).toBeTruthy()
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    const titleInput = screen.getByTestId('input-title') as HTMLInputElement
    await user.type(titleInput, 'New Piece')
    await user.type(screen.getByTestId('input-medium'), 'Gouache')
    await user.type(screen.getByTestId('input-year'), '2024')
    await user.click(screen.getByTestId('submit-artwork'))
    expect(titleInput.value).toBe('')
  })

  it('artwork-count reflects total, not filtered count', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'silent')
    expect(screen.getByTestId('artwork-count').textContent).toBe('4 works')
  })
})
