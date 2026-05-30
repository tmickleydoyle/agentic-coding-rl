import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToSubs(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-subscriptions'))
}

describe('subscriptions page', () => {
  it('lists all seeded subscriptions including cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToSubs(user)
    const list = screen.getByTestId('sub-list')
    expect(within(list).getByText('Netflix')).toBeInTheDocument()
    expect(within(list).getByText('Old Gym')).toBeInTheDocument()
    expect(screen.getByTestId('sub-s4')).toHaveAttribute('data-active', 'false')
  })

  it('shows the normalized monthly cost for an annual subscription', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToSubs(user)
    // Amazon Prime is annual 120 => monthly 10
    expect(screen.getByTestId('sub-s3-cycle')).toHaveTextContent('annual')
    expect(screen.getByTestId('sub-s3-cost')).toHaveTextContent('120')
    expect(screen.getByTestId('sub-s3-monthly')).toHaveTextContent('10')
  })

  it('cancels a subscription and marks it inactive', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToSubs(user)
    expect(screen.getByTestId('sub-s2')).toHaveAttribute('data-active', 'true')
    await user.click(screen.getByTestId('cancel-s2'))
    expect(screen.getByTestId('sub-s2')).toHaveAttribute('data-active', 'false')
    expect(screen.getByTestId('sub-s2-cancelled')).toBeInTheDocument()
    expect(screen.queryByTestId('cancel-s2')).not.toBeInTheDocument()
  })

  it('hides cancelled subscriptions when active-only is checked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToSubs(user)
    expect(screen.getByTestId('sub-s4')).toBeInTheDocument()
    await user.click(screen.getByTestId('active-only'))
    expect(screen.queryByTestId('sub-s4')).not.toBeInTheDocument()
    expect(screen.getByTestId('sub-s1')).toBeInTheDocument()
  })
})
