// HELD-OUT generalization tests — fresh sequences and edge cases.
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

describe('Customer Reviews app (held-out)', () => {
  it('marking all reviews as responded shows 0 unresponded in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Alice and Bob not yet responded; Carol already responded
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    await u.click(within(reviewRow('Bob')).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 3')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 0')).toBeInTheDocument()
  })

  it('filter shows 0 when all are responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    await u.click(within(reviewRow('Bob')).getByRole('button', { name: 'Mark responded' }))
    await u.click(screen.getByRole('button', { name: 'Show unresponded only' }))
    expect(screen.getByText('Showing: 0 reviews')).toBeInTheDocument()
  })

  it('average rating recalculates correctly after adding a 1-star review', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed: 5,3,4 => avg 4.0; adding 1 => (5+3+4+1)/4 = 3.25 => 3.3
    await addReview(u, 'Hank', 1)
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 3.3')).toBeInTheDocument()
  })

  it('stats total updates after adding two reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Iris', 5)
    await addReview(u, 'Jake', 5)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 5')).toBeInTheDocument()
  })

  it('un-toggling Carol responded updates stats unresponded count', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Carol is responded by default; toggle her off
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: 'Responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 0')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 3')).toBeInTheDocument()
  })

  it('filter then respond removes item when filter is active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show unresponded only' }))
    // Alice is visible (unresponded); mark responded => disappears
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 reviews')).toBeInTheDocument()
  })

  it('new review appears in Stats total without leaving Reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Lena', 4)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 4')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 3')).toBeInTheDocument()
  })

  it('theme persists after multiple view switches', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Reviews')
    await nav(u, 'Stats')
    await nav(u, 'Settings')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })
})
