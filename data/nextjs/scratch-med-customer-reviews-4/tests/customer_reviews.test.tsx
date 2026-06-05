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
    expect(screen.getByRole('heading', { name: /reviews/i })).toBeInTheDocument()
  })

  it('seeds three reviews on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows seeded review ratings', () => {
    render(<App />)
    expect(screen.getByText('Rating: 5')).toBeInTheDocument()
    expect(screen.getByText('Rating: 3')).toBeInTheDocument()
    expect(screen.getByText('Rating: 4')).toBeInTheDocument()
  })

  it('heading shows count of visible reviews', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: /reviews/i })).toBeInTheDocument()
  })

  it('adds a new review and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Dave', '4')
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (4)' })).toBeInTheDocument()
  })

  it('ignores a review with a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^rating$/i))
    await u.type(screen.getByLabelText(/^rating$/i), '3')
    await u.click(screen.getByRole('button', { name: /add review/i }))
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('ignores a review with a rating out of range', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Eve', '6')
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('ignores a review with rating 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Frank', '0')
    expect(screen.queryByText('Frank')).not.toBeInTheDocument()
  })

  it('Bob is already responded on load', () => {
    render(<App />)
    const row = reviewRow('Bob')
    expect(within(row).getByRole('button', { name: /responded/i })).toBeDisabled()
  })

  it('Mark responded button marks a review as responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = reviewRow('Alice')
    await u.click(within(row).getByRole('button', { name: /mark responded/i }))
    expect(within(row).getByRole('button', { name: /responded/i })).toBeDisabled()
  })

  it('filter shows only unresponded reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (2)' })).toBeInTheDocument()
  })

  it('marking a review responded removes it from unresponded filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: /mark responded/i }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
  })

  it('stats show correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 3')).toBeInTheDocument()
    expect(screen.getByText('Responded: 1')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 2')).toBeInTheDocument()
  })

  it('stats show average rating for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (5+3+4)/3 = 4.0
    expect(screen.getByText('Average rating: 4.0')).toBeInTheDocument()
  })

  it('marking a review responded updates stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('adding a review updates stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Grace', '5')
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 4')).toBeInTheDocument()
  })

  it('stats average rating updates when a new review is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Hank', '1')
    await nav(u, 'Stats')
    // (5+3+4+1)/4 = 3.25 -> 3.3
    expect(screen.getByText('Average rating: 3.3')).toBeInTheDocument()
  })

  it('theme defaults to light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reviews')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Reviews (2)' })).toBeInTheDocument()
  })
})
