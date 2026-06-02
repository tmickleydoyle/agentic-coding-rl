import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addReview(u: U, customer: string, rating: number) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
  await u.clear(screen.getByLabelText(/^rating$/i))
  await u.type(screen.getByLabelText(/^rating$/i), String(rating))
  await u.click(screen.getByRole('button', { name: /add review/i }))
}

function reviewRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

describe('Customer Reviews app', () => {
  it('starts on the Reviews view with heading Reviews (0)', () => {
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

  it('navigates back to Reviews from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
  })

  it('adds a review and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Alice', 5)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(within(reviewRow('Alice')).getByText('Rating: 5')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
  })

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add review/i }))
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
  })

  it('new review shows Mark responded button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Bob', 3)
    expect(within(reviewRow('Bob')).getByRole('button', { name: /mark responded/i })).toBeInTheDocument()
  })

  it('toggles responded status to Mark unresponded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Carol', 4)
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i }))
    expect(within(reviewRow('Carol')).getByRole('button', { name: /mark unresponded/i })).toBeInTheDocument()
  })

  it('toggles responded back to unresponded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Dan', 2)
    await u.click(within(reviewRow('Dan')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Dan')).getByRole('button', { name: /mark unresponded/i }))
    expect(within(reviewRow('Dan')).getByRole('button', { name: /mark responded/i })).toBeInTheDocument()
  })

  it('filter checkbox hides responded reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Eve', 5)
    await addReview(u, 'Frank', 3)
    await u.click(within(reviewRow('Eve')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByText('Frank')).toBeInTheDocument()
  })

  it('heading count reflects filtered list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Grace', 4)
    await addReview(u, 'Heidi', 2)
    await u.click(within(reviewRow('Grace')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByLabelText(/show unresponded only/i)).toBeChecked()
  })

  it('stats show 0.0 average when no reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 0')).toBeInTheDocument()
    expect(screen.getByText('Average rating: 0.0')).toBeInTheDocument()
  })

  it('stats reflect added reviews (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Ivan', 4)
    await addReview(u, 'Judy', 2)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 2')).toBeInTheDocument()
    expect(screen.getByText('Average rating: 3.0')).toBeInTheDocument()
  })

  it('stats update when a review is marked responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Karl', 5)
    await addReview(u, 'Lena', 3)
    await u.click(within(reviewRow('Karl')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 1')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('stats average rounds to one decimal place', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Mia', 5)
    await addReview(u, 'Ned', 4)
    await addReview(u, 'Olive', 3)
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 4.0')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view changes', async () => {
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

  it('reviews state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Paula', 5)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Paula')).toBeInTheDocument()
  })

  it('multiple reviews show correct total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Quinn', 5)
    await addReview(u, 'Rosa', 4)
    await addReview(u, 'Sam', 3)
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('unfiltering shows all reviews again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Tina', 5)
    await addReview(u, 'Uma', 2)
    await u.click(within(reviewRow('Tina')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.queryByText('Tina')).not.toBeInTheDocument()
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByText('Tina')).toBeInTheDocument()
    expect(screen.getByText('Uma')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (2)' })).toBeInTheDocument()
  })
})
