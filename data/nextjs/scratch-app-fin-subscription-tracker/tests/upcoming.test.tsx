import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToUpcoming(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-upcoming'))
}

describe('upcoming renewals', () => {
  it('lists only the due-soon active subscriptions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToUpcoming(user)
    const list = screen.getByTestId('upcoming-list')
    // Amazon Prime (4 days) and Netflix (7 days) are due soon; Spotify (22) is not
    expect(within(list).getByText('Amazon Prime')).toBeInTheDocument()
    expect(within(list).getByText('Netflix')).toBeInTheDocument()
    expect(within(list).queryByText('Spotify')).not.toBeInTheDocument()
  })

  it('sorts upcoming renewals by days ascending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToUpcoming(user)
    const items = screen.getAllByTestId(/^upcoming-s\d+$/)
    expect(items[0]).toHaveAttribute('data-testid', 'upcoming-s3') // Amazon Prime, 4 days
    expect(items[1]).toHaveAttribute('data-testid', 'upcoming-s1') // Netflix, 7 days
    expect(screen.getByTestId('upcoming-s3-days')).toHaveTextContent('4')
    expect(screen.getByTestId('upcoming-s1-days')).toHaveTextContent('7')
  })

  it('removes a subscription from upcoming once cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscriptions'))
    await user.click(screen.getByTestId('cancel-s3')) // cancel Amazon Prime
    await goToUpcoming(user)
    expect(screen.queryByTestId('upcoming-s3')).not.toBeInTheDocument()
    expect(screen.getByTestId('upcoming-s1')).toBeInTheDocument()
  })
})
