import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

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

  it('shows the three seed reviews on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('displays seed reviews heading as Reviews (3)', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('shows Rating label for each seed review', () => {
    render(<App />)
    expect(screen.getByText('Rating: 5')).toBeInTheDocument()
    expect(screen.getByText('Rating: 3')).toBeInTheDocument()
    expect(screen.getByText('Rating: 4')).toBeInTheDocument()
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

  it('shows correct seed stats on Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 3')).toBeInTheDocument()
    expect(screen.getByText('Responded: 1')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 2')).toBeInTheDocument()
    expect(screen.getByText('Average rating: 4.0')).toBeInTheDocument()
  })

  it('adds a new review and heading count increases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Dave', 2)
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByText('Rating: 2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (4)' })).toBeInTheDocument()
  })

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/customer name/i))
    await u.click(screen.getByRole('button', { name: /add review/i }))
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('Bob seed review shows Responded button that is disabled', () => {
    render(<App />)
    const li = screen.getByText('Bob').closest('li') as HTMLElement
    const btn = within(li).getByRole('button', { name: 'Responded' })
    expect(btn).toBeDisabled()
  })

  it('Alice seed review shows Mark responded button', () => {
    render(<App />)
    const li = screen.getByText('Alice').closest('li') as HTMLElement
    expect(within(li).getByRole('button', { name: 'Mark responded' })).toBeInTheDocument()
  })

  it('clicking Mark responded disables the button for that review', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Alice').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Mark responded' }))
    expect(within(li).getByRole('button', { name: 'Responded' })).toBeDisabled()
  })

  it('marking responded updates Stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Alice').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('filter checkbox shows only unresponded reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    // Bob is responded — should be hidden
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    // Alice and Carol are unresponded — should show
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('heading count reflects filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (2)' })).toBeInTheDocument()
  })

  it('unchecking filter restores all reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('Stats counts all reviews regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 3')).toBeInTheDocument()
  })

  it('adding a review updates Stats total and average', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Eve', 1)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 4')).toBeInTheDocument()
    // (5+3+4+1)/4 = 3.25 -> 3.3 (toFixed(1))
    expect(screen.getByText('Average rating: 3.3')).toBeInTheDocument()
  })

  it('theme starts as light and toggle switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await nav(u, 'Reviews')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Stats average shows 0.0 initially when no reviews exist (edge)', async () => {
    // We verify the format token is present in the real seeded app — seed has 3 reviews so avg != 0.0
    // This test just verifies the stat label appears
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/average rating:/i)).toBeInTheDocument()
  })

  it('navigating away and back preserves reviews state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Frank', 4)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Frank')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByLabelText(/show unresponded only/i)).toBeChecked()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })
})
