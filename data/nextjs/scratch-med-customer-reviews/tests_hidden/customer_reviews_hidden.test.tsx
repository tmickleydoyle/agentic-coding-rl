// HELD-OUT generalization tests — fresh cross-view scenarios and edge cases.
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

describe('Customer Reviews (held-out)', () => {
  it('Carol starts as unresponded', () => {
    render(<App />)
    expect(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i })).toBeInTheDocument()
  })

  it('toggling Alice to unresponded updates her button label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: /mark unresponded/i }))
    expect(within(reviewRow('Alice')).getByRole('button', { name: /mark responded/i })).toBeInTheDocument()
  })

  it('toggling Alice to unresponded is reflected in Stats unresponded count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: /mark unresponded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 0')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 3')).toBeInTheDocument()
  })

  it('after marking Carol responded, filter shows only Bob', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('adding multiple reviews updates Stats total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Hank', 5)
    await addReview(u, 'Iris', 2)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 5')).toBeInTheDocument()
  })

  it('average rating recalculates after adding a review', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed: 5+3+4 = 12, add rating 2 => total 14/4 = 3.5
    await addReview(u, 'Jack', 2)
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 3.5')).toBeInTheDocument()
  })

  it('Stats unresponded increases when new review is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Karen', 3)
    await nav(u, 'Stats')
    expect(screen.getByText('Unresponded: 3')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    // filter should still be on — only Bob and Carol visible
    expect(screen.getByRole('heading', { name: 'Reviews (2)' })).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('theme toggles back to light on second press', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('all three nav buttons are visible at the same time', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Reviews' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('when all reviews are responded, filter shows empty list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Bob')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
  })

  it('Stats responded equals total when all are responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Bob')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 3')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 0')).toBeInTheDocument()
  })
})
