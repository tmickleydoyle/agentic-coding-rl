import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('responses view', () => {
  it('lists invites with status and extra guests', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    expect(screen.getByTestId('invite-i1-guest')).toHaveTextContent('Ada')
    expect(screen.getByTestId('invite-i1-status')).toHaveTextContent('yes')
    expect(screen.getByTestId('invite-i1-extra')).toHaveTextContent('2')
  })

  it('shows the per-status tally', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    expect(screen.getByTestId('tally-yes')).toHaveTextContent('1')
    expect(screen.getByTestId('tally-maybe')).toHaveTextContent('1')
    expect(screen.getByTestId('tally-pending')).toHaveTextContent('1')
    expect(screen.getByTestId('tally-no')).toHaveTextContent('0')
  })

  it('shows the event headcount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    expect(screen.getByTestId('event-headcount')).toHaveTextContent('3')
  })
})
