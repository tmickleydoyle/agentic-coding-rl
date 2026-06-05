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
  await u.clear(screen.getByLabelText(/^rating$/i))
  await u.type(screen.getByLabelText(/^rating$/i), String(rating))
  await u.click(screen.getByRole('button', { name: /add review/i }))
}

describe('Customer Reviews app', () => {
  it('starts on the Reviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('shows seeded reviews on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows correct initial Showing count with seed data', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 reviews')).toBeInTheDocument()
  })

  it('shows seeded ratings correctly', () => {
    render(<App />)
    expect(within(reviewRow('Alice')).getByText('Rating: 5')).toBeInTheDocument()
    expect(within(reviewRow('Bob')).getByText('Rating: 3')).toBeInTheDocument()
    expect(within(reviewRow('Carol')).getByText('Rating: 4')).toBeInTheDocument()
  })

  it('Carol is already responded on load', () => {
    render(<App />)
    expect(within(reviewRow('Carol')).getByRole('button', { name: 'Responded' })).toBeInTheDocument()
  })

  it('Alice and Bob show Mark responded on load', () => {
    render(<App />)
    expect(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' })).toBeInTheDocument()
    expect(within(reviewRow('Bob')).getByRole('button', { name: 'Mark responded' })).toBeInTheDocument()
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

  it('adds a new review and updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Dave', 4)
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 reviews')).toBeInTheDocument()
  })

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add review/i }))
    expect(screen.getByText('Showing: 3 reviews')).toBeInTheDocument()
  })

  it('toggles responded state on a review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    expect(within(reviewRow('Alice')).getByRole('button', { name: 'Responded' })).toBeInTheDocument()
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Responded' }))
    expect(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' })).toBeInTheDocument()
  })

  it('filters to unresponded only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show unresponded only' }))
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 reviews')).toBeInTheDocument()
  })

  it('filter button label toggles between Show unresponded only and Show all', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Show unresponded only' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Show unresponded only' }))
    expect(screen.getByRole('button', { name: 'Show all' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Show all' }))
    expect(screen.getByRole('button', { name: 'Show unresponded only' })).toBeInTheDocument()
  })

  it('stats show correct totals with seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 3')).toBeInTheDocument()
    expect(screen.getByText('Responded: 1')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 2')).toBeInTheDocument()
  })

  it('stats show correct average rating with seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (5+3+4)/3 = 4.0
    expect(screen.getByText('Average rating: 4.0')).toBeInTheDocument()
  })

  it('stats update after marking a review as responded (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Bob')).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('stats update after adding a new review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Eve', 2)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 4')).toBeInTheDocument()
    // (5+3+4+2)/4 = 3.5
    expect(screen.getByText('Average rating: 3.5')).toBeInTheDocument()
  })

  it('toggles the theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reviews')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('reviews state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Frank', 3)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 reviews')).toBeInTheDocument()
  })

  it('filter state resets to show all when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show unresponded only' }))
    expect(screen.getByText('Showing: 2 reviews')).toBeInTheDocument()
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    // local filter state resets on remount — acceptable UX
    expect(screen.getByText('Showing: 3 reviews')).toBeInTheDocument()
  })

  it('new review starts as unresponded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Grace', 5)
    expect(within(reviewRow('Grace')).getByRole('button', { name: 'Mark responded' })).toBeInTheDocument()
  })
})
