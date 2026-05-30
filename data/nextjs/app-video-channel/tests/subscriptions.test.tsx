import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('subscriptions', () => {
  it('shows no-subscriptions initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscriptions'))
    expect(screen.getByTestId('no-subscriptions')).toBeInTheDocument()
  })

  it('lists subscribed channels and counts them', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('subscribe-toggle')) // subscribe ch1
    await user.click(screen.getByTestId('switch-ch2'))
    await user.click(screen.getByTestId('subscribe-toggle')) // subscribe ch2
    await user.click(screen.getByTestId('nav-subscriptions'))
    expect(screen.getByTestId('subscribed-count-value')).toHaveTextContent('2')
    expect(screen.getByTestId('sub-ch1-name')).toHaveTextContent('CodeCast')
    expect(screen.getByTestId('sub-ch2-name')).toHaveTextContent('DesignDaily')
  })

  it('unsubscribing from the subscriptions page removes the channel', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('subscribe-toggle'))
    await user.click(screen.getByTestId('nav-subscriptions'))
    await user.click(screen.getByTestId('unsub-ch1'))
    expect(screen.getByTestId('no-subscriptions')).toBeInTheDocument()
  })
})
