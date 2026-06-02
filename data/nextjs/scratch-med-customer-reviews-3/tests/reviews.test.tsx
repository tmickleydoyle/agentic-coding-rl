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

describe('Customer Reviews app', () => {
  it('starts on the Reviews view with zero reviews', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
  })

  it('adds a review and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Alice', '5')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(within(reviewRow('Alice')).getByText('Rating: 5')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
  })

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^rating$/i))
    await u.type(screen.getByLabelText(/^rating$/i), '4')
    await u.click(screen.getByRole('button', { name: /add review/i }))
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
  })

  it('ignores a rating outside 1-5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Bob', '6')
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
    await addReview(u, 'Bob', '0')
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
  })

  it('marks a review as responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Carol', '3')
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i }))
    expect(within(reviewRow('Carol')).getByText('Responded')).toBeInTheDocument()
    expect(within(reviewRow('Carol')).getByRole('button', { name: /mark unresponded/i })).toBeInTheDocument()
  })

  it('toggles responded status back to unresponded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Dave', '4')
    await u.click(within(reviewRow('Dave')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Dave')).getByRole('button', { name: /mark unresponded/i }))
    expect(within(reviewRow('Dave')).queryByText('Responded')).not.toBeInTheDocument()
    expect(within(reviewRow('Dave')).getByRole('button', { name: /mark responded/i })).toBeInTheDocument()
  })

  it('filters to unresponded only when checkbox is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Eve', '5')
    await addReview(u, 'Frank', '2')
    await u.click(within(reviewRow('Eve')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByText('Frank')).toBeInTheDocument()
  })

  it('heading count is not affected by the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Grace', '4')
    await addReview(u, 'Hank', '3')
    await u.click(within(reviewRow('Grace')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (2)' })).toBeInTheDocument()
  })

  it('shows all reviews again when filter is unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Iris', '5')
    await addReview(u, 'Jack', '1')
    await u.click(within(reviewRow('Iris')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByText('Iris')).toBeInTheDocument()
    expect(screen.getByText('Jack')).toBeInTheDocument()
  })

  it('Stats shows zero average when no reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 0')).toBeInTheDocument()
    expect(screen.getByText('Average rating: 0.0')).toBeInTheDocument()
  })

  it('Stats reflects added reviews (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Kim', '4')
    await addReview(u, 'Leo', '2')
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 2')).toBeInTheDocument()
    expect(screen.getByText('Average rating: 3.0')).toBeInTheDocument()
  })

  it('Stats shows responded and unresponded counts correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Mia', '5')
    await addReview(u, 'Ned', '3')
    await addReview(u, 'Ora', '4')
    await u.click(within(reviewRow('Mia')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 1')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 2')).toBeInTheDocument()
  })

  it('Stats average updates when responded toggle is changed (cross-view state persists)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Pat', '4')
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 1')).toBeInTheDocument()
    await nav(u, 'Reviews')
    await addReview(u, 'Quinn', '2')
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 2')).toBeInTheDocument()
    expect(screen.getByText('Average rating: 3.0')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
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
    await nav(u, 'Reviews')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('review state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Rosa', '5')
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Rosa')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
  })

  it('average rating rounds to one decimal place', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Sam', '5')
    await addReview(u, 'Tina', '5')
    await addReview(u, 'Uma', '4')
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 4.7')).toBeInTheDocument()
  })
})
