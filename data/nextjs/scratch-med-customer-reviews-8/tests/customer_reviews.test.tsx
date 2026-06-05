import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function reviewRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

async function addReview(u: U, customer: string, rating: string) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
  await u.clear(screen.getByLabelText(/^rating$/i))
  await u.type(screen.getByLabelText(/^rating$/i), rating)
  await u.click(screen.getByRole('button', { name: /add review/i }))
}

describe('Customer Reviews app', () => {
  it('starts on the Reviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('shows three seeded reviews on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.getByText('Showing: 3 reviews')).toBeInTheDocument()
  })

  it('shows correct ratings for seeded reviews', () => {
    render(<App />)
    expect(within(reviewRow('Alice')).getByText('Rating: 5')).toBeInTheDocument()
    expect(within(reviewRow('Bob')).getByText('Rating: 3')).toBeInTheDocument()
    expect(within(reviewRow('Carol')).getByText('Rating: 4')).toBeInTheDocument()
  })

  it('Bob seeded as responded — button is disabled', () => {
    render(<App />)
    expect(within(reviewRow('Bob')).getByRole('button', { name: 'Responded' })).toBeDisabled()
  })

  it('Alice and Carol seeded as unresponded — button enabled', () => {
    render(<App />)
    expect(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' })).not.toBeDisabled()
    expect(within(reviewRow('Carol')).getByRole('button', { name: 'Mark responded' })).not.toBeDisabled()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('adds a new review and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Diana', '5')
    expect(screen.getByText('Diana')).toBeInTheDocument()
    expect(within(reviewRow('Diana')).getByText('Rating: 5')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 reviews')).toBeInTheDocument()
  })

  it('ignores a review with a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^rating$/i))
    await u.type(screen.getByLabelText(/^rating$/i), '4')
    await u.click(screen.getByRole('button', { name: /add review/i }))
    expect(screen.getByText('Showing: 3 reviews')).toBeInTheDocument()
  })

  it('ignores a review with a rating of 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Eve', '0')
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 3 reviews')).toBeInTheDocument()
  })

  it('ignores a review with a rating of 6', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Frank', '6')
    expect(screen.queryByText('Frank')).not.toBeInTheDocument()
  })

  it('marks a review as responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    expect(within(reviewRow('Alice')).getByRole('button', { name: 'Responded' })).toBeDisabled()
  })

  it('filter show unresponded only hides responded reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 reviews')).toBeInTheDocument()
  })

  it('unchecking filter restores all reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByText('Showing: 3 reviews')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('marking responded reduces unresponded count in filter view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByText('Showing: 2 reviews')).toBeInTheDocument()
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    expect(screen.getByText('Showing: 1 reviews')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('stats view shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 3')).toBeInTheDocument()
    expect(screen.getByText('Responded: 1')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 2')).toBeInTheDocument()
  })

  it('stats shows correct seeded average rating', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (5 + 3 + 4) / 3 = 4.0
    expect(screen.getByText('Average rating: 4.0')).toBeInTheDocument()
  })

  it('stats updates after adding a review (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Diana', '1')
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 4')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 3')).toBeInTheDocument()
    // (5+3+4+1)/4 = 3.25 -> 3.3
    expect(screen.getByText('Average rating: 3.3')).toBeInTheDocument()
  })

  it('stats updates responded count after marking responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('settings toggles theme data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Reviews')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Showing: 2 reviews')).toBeInTheDocument()
  })

  it('new review starts as unresponded and appears in stats unresponded count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Greg', '2')
    await nav(u, 'Stats')
    expect(screen.getByText('Unresponded: 3')).toBeInTheDocument()
  })
})
