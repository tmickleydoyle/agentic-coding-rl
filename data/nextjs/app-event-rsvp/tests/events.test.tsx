import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('events view', () => {
  it('lists events with their headcounts', () => {
    render(<App />)
    expect(screen.getByTestId('event-e1-name')).toHaveTextContent('Launch Party')
    // e1: Ada yes 1+2 = 3
    expect(screen.getByTestId('event-e1-headcount')).toHaveTextContent('3')
    // e2: only a 'no' -> 0
    expect(screen.getByTestId('event-e2-headcount')).toHaveTextContent('0')
  })

  it('shows the total headcount across all events', () => {
    render(<App />)
    expect(screen.getByTestId('total-headcount')).toHaveTextContent('3')
  })

  it('selecting an event opens its responses page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    expect(screen.getByTestId('page-responses')).toBeInTheDocument()
    expect(screen.getByTestId('event-name')).toHaveTextContent('Launch Party')
  })

  it('shows no-event on responses without a selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-responses'))
    expect(screen.getByTestId('no-event')).toBeInTheDocument()
  })
})
