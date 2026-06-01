import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('events view', () => {
  it('lists all events with details', () => {
    render(<App />)
    expect(screen.getByTestId('event-e1-name')).toHaveTextContent('Synth Fest')
    expect(screen.getByTestId('event-e1-venue')).toHaveTextContent('Hall A')
    expect(screen.getByTestId('event-e2-name')).toHaveTextContent('Code Camp')
  })

  it('selecting an event opens its detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    expect(screen.getByTestId('page-event-detail')).toBeInTheDocument()
    expect(screen.getByTestId('event-name')).toHaveTextContent('Synth Fest')
  })

  it('shows no-event when navigating to detail without a selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-event-detail'))
    expect(screen.getByTestId('no-event')).toBeInTheDocument()
  })
})
