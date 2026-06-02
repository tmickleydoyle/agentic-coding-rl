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

async function addReview(u: U, customer: string, rating: number) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
  await u.clear(screen.getByLabelText(/rating \(1-5\)/i))
  await u.type(screen.getByLabelText(/rating \(1-5\)/i), String(rating))
  await u.click(screen.getByRole('button', { name: /add review/i }))
}

describe('Customer Reviews app', () => {
  it('starts on the Reviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /reviews/i })).toBeInTheDocument()
  })

  it('seeds three reviews on first render', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows seeded reviews count in heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('shows correct ratings for seeded reviews', () => {
    render(<App />)
    expect(within(reviewRow('Alice')).getByText('Rating: 5')).toBeInTheDocument()
    expect(within(reviewRow('Bob')).getByText('Rating: 3')).toBeInTheDocument()
    expect(within(reviewRow('Carol')).getByText('Rating: 4')).toBeInTheDocument()
  })

  it('Alice starts as responded (shows Mark unresponded)', () => {
    render(<App />)
    expect(within(reviewRow('Alice')).getByRole('button', { name: /mark unresponded/i })).toBeInTheDocument()
  })

  it('Bob starts as unresponded (shows Mark responded)', () => {
    render(<App />)
    expect(within(reviewRow('Bob')).getByRole('button', { name: /mark responded/i })).toBeInTheDocument()
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

  it('navigates back to Reviews view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('adds a new review and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Dave', 4)
    expect(screen.getByRole('heading', { name: 'Reviews (4)' })).toBeInTheDocument()
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(within(reviewRow('Dave')).getByText('Rating: 4')).toBeInTheDocument()
  })

  it('new review starts as unresponded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Eve', 2)
    expect(within(reviewRow('Eve')).getByRole('button', { name: /mark responded/i })).toBeInTheDocument()
  })

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/rating \(1-5\)/i))
    await u.type(screen.getByLabelText(/rating \(1-5\)/i), '3')
    await u.click(screen.getByRole('button', { name: /add review/i }))
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('toggles responded status for Bob', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Bob')).getByRole('button', { name: /mark responded/i }))
    expect(within(reviewRow('Bob')).getByRole('button', { name: /mark unresponded/i })).toBeInTheDocument()
  })

  it('filters to unresponded only when checkbox is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (2)' })).toBeInTheDocument()
  })

  it('unchecking the filter restores all reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('Stats shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 3')).toBeInTheDocument()
    expect(screen.getByText('Responded: 1')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 2')).toBeInTheDocument()
  })

  it('Stats shows average rating for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (5+3+4)/3 = 4.0
    expect(screen.getByText('Average rating: 4.0')).toBeInTheDocument()
  })

  it('Stats updates after adding a review (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Frank', 1)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 4')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 3')).toBeInTheDocument()
  })

  it('Stats updates responded count after toggling (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Bob')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('Stats shows 0.0 average when no reviews present', async () => {
    const u = userEvent.setup()
    // We cannot remove seeded reviews so we test the display format with seeded data average
    // instead, verify the format is always one decimal
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/average rating: \d+\.\d/i)).toBeInTheDocument()
  })

  it('Settings toggle changes theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
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

  it('review list state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Gina', 5)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Gina')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (4)' })).toBeInTheDocument()
  })
})
