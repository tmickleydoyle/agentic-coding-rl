// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addReview(u: U, customer: string, rating: string) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
  await u.clear(screen.getByLabelText(/^rating$/i))
  await u.type(screen.getByLabelText(/^rating$/i), rating)
  await u.click(screen.getByRole('button', { name: /add review/i }))
}

function reviewRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

describe('Customer Reviews (held-out)', () => {
  it('accepts boundary rating of 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Min Rater', '1')
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
    expect(within(reviewRow('Min Rater')).getByText('Rating: 1')).toBeInTheDocument()
  })

  it('accepts boundary rating of 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Max Rater', '5')
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
    expect(within(reviewRow('Max Rater')).getByText('Rating: 5')).toBeInTheDocument()
  })

  it('multiple reviews increment heading count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'A', '3')
    await addReview(u, 'B', '4')
    await addReview(u, 'C', '5')
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('unresponded count in Stats matches reviews not yet responded to', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'X1', '3')
    await addReview(u, 'X2', '4')
    await addReview(u, 'X3', '2')
    await u.click(within(reviewRow('X1')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('X2')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('toggling responded updates Stats cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Toggle1', '5')
    await u.click(within(reviewRow('Toggle1')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 1')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 0')).toBeInTheDocument()
    await nav(u, 'Reviews')
    await u.click(within(reviewRow('Toggle1')).getByRole('button', { name: /mark unresponded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 0')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('filter hides multiple responded reviews at once', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Resp1', '4')
    await addReview(u, 'Resp2', '3')
    await addReview(u, 'Open1', '5')
    await u.click(within(reviewRow('Resp1')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Resp2')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.queryByText('Resp1')).not.toBeInTheDocument()
    expect(screen.queryByText('Resp2')).not.toBeInTheDocument()
    expect(screen.getByText('Open1')).toBeInTheDocument()
  })

  it('Stats average is correct for a single review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Solo', '3')
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 3.0')).toBeInTheDocument()
    expect(screen.getByText('Total reviews: 1')).toBeInTheDocument()
  })

  it('theme toggle switches back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('reviews state survives a round-trip through Stats and Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'RoundTrip', '4')
    await nav(u, 'Stats')
    await nav(u, 'Settings')
    await nav(u, 'Reviews')
    expect(screen.getByText('RoundTrip')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
  })

  it('average rating of 5 5 4 rounds to 4.7', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'P', '5')
    await addReview(u, 'Q', '5')
    await addReview(u, 'R', '4')
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 4.7')).toBeInTheDocument()
  })
})
