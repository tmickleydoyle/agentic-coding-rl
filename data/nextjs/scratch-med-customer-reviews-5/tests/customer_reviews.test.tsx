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

  it('shows seed data on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('heading shows count of visible reviews on load', () => {
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

  it('navigates back to Reviews view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: /reviews/i })).toBeInTheDocument()
  })

  it('shows seed ratings in review rows', () => {
    render(<App />)
    expect(within(reviewRow('Alice')).getByText('Rating: 5')).toBeInTheDocument()
    expect(within(reviewRow('Bob')).getByText('Rating: 3')).toBeInTheDocument()
    expect(within(reviewRow('Carol')).getByText('Rating: 4')).toBeInTheDocument()
  })

  it('Bob starts as responded (shows Mark unresponded)', () => {
    render(<App />)
    expect(within(reviewRow('Bob')).getByRole('button', { name: 'Mark unresponded' })).toBeInTheDocument()
  })

  it('Alice and Carol start unresponded (shows Mark responded)', () => {
    render(<App />)
    expect(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' })).toBeInTheDocument()
    expect(within(reviewRow('Carol')).getByRole('button', { name: 'Mark responded' })).toBeInTheDocument()
  })

  it('toggles a review to responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    expect(within(reviewRow('Alice')).getByRole('button', { name: 'Mark unresponded' })).toBeInTheDocument()
  })

  it('toggles a review back to unresponded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Bob')).getByRole('button', { name: 'Mark unresponded' }))
    expect(within(reviewRow('Bob')).getByRole('button', { name: 'Mark responded' })).toBeInTheDocument()
  })

  it('adds a new review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Dave', 4)
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(within(reviewRow('Dave')).getByText('Rating: 4')).toBeInTheDocument()
  })

  it('new review starts unresponded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Eve', 5)
    expect(within(reviewRow('Eve')).getByRole('button', { name: 'Mark responded' })).toBeInTheDocument()
  })

  it('ignores blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/customer name/i))
    await u.type(screen.getByLabelText(/rating \(1-5\)/i), '3')
    await u.click(screen.getByRole('button', { name: /add review/i }))
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('heading count updates after adding a review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Frank', 2)
    expect(screen.getByRole('heading', { name: 'Reviews (4)' })).toBeInTheDocument()
  })

  it('filter unresponded only hides responded reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/filter: unresponded only/i))
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('filter updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/filter: unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (2)' })).toBeInTheDocument()
  })

  it('stats view shows correct seed totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 3')).toBeInTheDocument()
    expect(screen.getByText('Responded: 1')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 2')).toBeInTheDocument()
  })

  it('stats view shows correct seed average rating', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (5 + 3 + 4) / 3 = 4.0
    expect(screen.getByText('Average rating: 4.0')).toBeInTheDocument()
  })

  it('stats reflects toggling responded (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('stats reflects a newly added review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Gina', 5)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 4')).toBeInTheDocument()
    // (5+3+4+5)/4 = 4.25 -> 4.3
    expect(screen.getByText('Average rating: 4.3')).toBeInTheDocument()
  })

  it('stats ignores the filter (shows all reviews)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/filter: unresponded only/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 3')).toBeInTheDocument()
  })

  it('theme defaults to light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme changes to dark', async () => {
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
})
