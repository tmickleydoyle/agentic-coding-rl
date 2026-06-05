import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('queue and subscriptions', () => {
  it('shows queue-empty initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('queue-empty')).toBeInTheDocument()
    expect(screen.getByTestId('queue-minutes')).toHaveTextContent('0')
  })

  it('totals the queue minutes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-sh1'))
    await user.click(screen.getByTestId('enqueue-e1'))
    await user.click(screen.getByTestId('enqueue-e2'))
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('queue-minutes')).toHaveTextContent('75')
  })

  it('does not duplicate an enqueued episode', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-sh1'))
    await user.click(screen.getByTestId('enqueue-e1'))
    await user.click(screen.getByTestId('enqueue-e1'))
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getAllByTestId('q-ep-e1')).toHaveLength(1)
  })

  it('removes an episode from the queue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-sh1'))
    await user.click(screen.getByTestId('enqueue-e1'))
    await user.click(screen.getByTestId('nav-queue'))
    await user.click(screen.getByTestId('remove-q-e1'))
    expect(screen.getByTestId('queue-empty')).toBeInTheDocument()
  })

  it('lists subscribed shows and the unplayed count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscriptions'))
    expect(screen.getByTestId('sub-sh1')).toBeInTheDocument()
    expect(screen.queryByTestId('sub-sh2')).not.toBeInTheDocument()
    // unplayed: e2, e3, e4 = 3
    expect(screen.getByTestId('unplayed-count')).toHaveTextContent('3')
  })

  it('unsubscribing removes a show and shows subs-empty when none remain', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscriptions'))
    await user.click(screen.getByTestId('unsub-sh1'))
    expect(screen.getByTestId('subs-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('subs-list')).not.toBeInTheDocument()
  })
})
