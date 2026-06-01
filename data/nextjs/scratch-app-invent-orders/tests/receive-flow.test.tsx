import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openDetail(user: ReturnType<typeof userEvent.setup>, viewId: string) {
  await user.click(screen.getByTestId(viewId))
}

describe('receive flow', () => {
  it('receives a partial quantity and updates received/outstanding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'view-po2') // 20/50
    await user.clear(screen.getByTestId('receive-input'))
    await user.type(screen.getByTestId('receive-input'), '10')
    await user.click(screen.getByTestId('receive'))
    expect(screen.getByTestId('detail-received')).toHaveTextContent('30')
    expect(screen.getByTestId('detail-outstanding')).toHaveTextContent('20')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('partial')
  })

  it('clamps received at the ordered amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'view-po2') // 20/50
    await user.clear(screen.getByTestId('receive-input'))
    await user.type(screen.getByTestId('receive-input'), '999')
    await user.click(screen.getByTestId('receive'))
    expect(screen.getByTestId('detail-received')).toHaveTextContent('50')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('received')
  })

  it('receive all fully receives the order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'view-po3') // 0/200 open
    await user.click(screen.getByTestId('receive-all'))
    expect(screen.getByTestId('detail-received')).toHaveTextContent('200')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('received')
  })

  it('moving from open to partial flips status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'view-po3') // open
    await user.clear(screen.getByTestId('receive-input'))
    await user.type(screen.getByTestId('receive-input'), '5')
    await user.click(screen.getByTestId('receive'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('partial')
  })

  it('cancelling an order sets status cancelled and disables receive', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'view-po3')
    await user.click(screen.getByTestId('cancel'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('cancelled')
    expect(screen.getByTestId('receive')).toBeDisabled()
  })

  it('reflects a receive back on the orders list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'view-po3') // 0/200
    await user.click(screen.getByTestId('receive-all'))
    await user.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('order-po3')).toHaveAttribute('data-status', 'received')
    expect(screen.getByTestId('order-po3-progress')).toHaveTextContent('200/200')
  })
})
