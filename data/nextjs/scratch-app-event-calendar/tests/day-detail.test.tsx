import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('day detail view', () => {
  it('shows no-day when no day is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-event-detail'))
    expect(screen.getByTestId('no-day')).toBeInTheDocument()
  })

  it('shows no-events for a day with nothing scheduled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('day-10'))
    expect(screen.getByTestId('no-events')).toBeInTheDocument()
    expect(screen.queryByTestId('day-events')).not.toBeInTheDocument()
  })

  it('lists the events for the selected day with categories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('day-15'))
    expect(screen.getByTestId('event-v3-title')).toHaveTextContent('Gym')
    expect(screen.getByTestId('event-v3-category')).toHaveTextContent('personal')
  })
})
