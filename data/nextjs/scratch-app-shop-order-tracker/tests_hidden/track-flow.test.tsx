import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openTrack(user: ReturnType<typeof userEvent.setup>, orderTestId: string) {
  await user.click(screen.getByTestId(orderTestId))
  await user.click(screen.getByTestId('go-track'))
}

describe('tracking timeline', () => {
  it('marks reached steps for a delivered order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openTrack(user, 'view-o1') // delivered
    expect(screen.getByTestId('step-placed')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('step-shipped')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('step-delivered')).toHaveAttribute('data-reached', 'true')
  })

  it('marks only placed for a placed order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openTrack(user, 'view-o3') // placed
    expect(screen.getByTestId('step-placed')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('step-shipped')).toHaveAttribute('data-reached', 'false')
    expect(screen.getByTestId('step-delivered')).toHaveAttribute('data-reached', 'false')
  })

  it('advances an order one step along the timeline', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openTrack(user, 'view-o3') // placed
    await user.click(screen.getByTestId('advance'))
    expect(screen.getByTestId('step-shipped')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('track-status')).toHaveTextContent('shipped')
    await user.click(screen.getByTestId('advance'))
    expect(screen.getByTestId('step-delivered')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('track-status')).toHaveTextContent('delivered')
  })

  it('does not advance past delivered', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openTrack(user, 'view-o1') // delivered
    await user.click(screen.getByTestId('advance'))
    expect(screen.getByTestId('track-status')).toHaveTextContent('delivered')
  })

  it('reflects the advanced status back on the orders list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openTrack(user, 'view-o3') // placed
    await user.click(screen.getByTestId('advance')) // -> shipped
    await user.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('order-o3')).toHaveAttribute('data-status', 'shipped')
  })
})
