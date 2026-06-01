import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openP1(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('open-p1'))
}

describe('rsvp + queue flow', () => {
  it('toggles RSVP on and off with a flag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openP1(user)
    expect(screen.queryByTestId('rsvp-flag')).not.toBeInTheDocument()
    expect(screen.getByTestId('rsvp-toggle')).toHaveTextContent('RSVP')
    await user.click(screen.getByTestId('rsvp-toggle'))
    expect(screen.getByTestId('rsvp-flag')).toBeInTheDocument()
    expect(screen.getByTestId('rsvp-toggle')).toHaveTextContent('Cancel RSVP')
    await user.click(screen.getByTestId('rsvp-toggle'))
    expect(screen.queryByTestId('rsvp-flag')).not.toBeInTheDocument()
  })

  it('queues a video and clears the input', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openP1(user)
    expect(screen.getByTestId('queue-count')).toHaveTextContent('0')
    await user.type(screen.getByTestId('queue-input'), 'Keynote')
    await user.click(screen.getByTestId('queue-add'))
    expect(screen.getByTestId('queue-count')).toHaveTextContent('1')
    expect(screen.getByTestId('queue-item-0-title')).toHaveTextContent('Keynote')
    expect(screen.getByTestId('queue-input')).toHaveValue('')
  })

  it('does not queue empty/whitespace titles', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openP1(user)
    await user.type(screen.getByTestId('queue-input'), '   ')
    await user.click(screen.getByTestId('queue-add'))
    expect(screen.getByTestId('queue-count')).toHaveTextContent('0')
  })

  it('removes a queued video by index', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openP1(user)
    await user.type(screen.getByTestId('queue-input'), 'A')
    await user.click(screen.getByTestId('queue-add'))
    await user.type(screen.getByTestId('queue-input'), 'B')
    await user.click(screen.getByTestId('queue-add'))
    expect(screen.getByTestId('queue-count')).toHaveTextContent('2')
    await user.click(screen.getByTestId('queue-remove-0'))
    expect(screen.getByTestId('queue-count')).toHaveTextContent('1')
    expect(screen.getByTestId('queue-item-0-title')).toHaveTextContent('B')
  })

  it('seeded queue item is present on p2', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('filter-past'))
    await user.click(screen.getByTestId('open-p2'))
    expect(screen.getByTestId('queue-count')).toHaveTextContent('1')
    expect(screen.getByTestId('queue-item-0-title')).toHaveTextContent('Intro')
  })
})
