import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function addAndGoToCoupons(user: ReturnType<typeof userEvent.setup>, addIds: string[]) {
  for (let i = 0; i < addIds.length; i++) {
    await user.click(screen.getByTestId(addIds[i]))
  }
  await user.click(screen.getByTestId('nav-coupons'))
}

describe('coupon flow', () => {
  it('lists the available coupons', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-coupons'))
    const list = screen.getByTestId('coupon-list')
    expect(within(list).getByTestId('coupon-SAVE10')).toBeInTheDocument()
    expect(within(list).getByTestId('coupon-FLAT5')).toBeInTheDocument()
    expect(within(list).getByTestId('coupon-BIG20')).toBeInTheDocument()
  })

  it('applies a percent coupon (case-insensitive) and shows the ok state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addAndGoToCoupons(user, ['add-c2']) // subtotal 30
    await user.type(screen.getByTestId('code-input'), 'save10')
    await user.click(screen.getByTestId('apply-code'))
    expect(screen.getByTestId('applied-ok')).toHaveTextContent('SAVE10')
  })

  it('shows an error for an unknown code', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-coupons'))
    await user.type(screen.getByTestId('code-input'), 'NOPE')
    await user.click(screen.getByTestId('apply-code'))
    expect(screen.getByTestId('applied-error')).toHaveTextContent('Unknown code')
    expect(screen.queryByTestId('applied-ok')).not.toBeInTheDocument()
  })

  it('warns when a min-spend coupon is applied below its threshold', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addAndGoToCoupons(user, ['add-c1']) // subtotal 12 (< 50)
    await user.type(screen.getByTestId('code-input'), 'BIG20')
    await user.click(screen.getByTestId('apply-code'))
    expect(screen.getByTestId('applied-warn')).toHaveTextContent('Spend at least 50')
    expect(screen.queryByTestId('applied-ok')).not.toBeInTheDocument()
  })

  it('clears an applied coupon', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addAndGoToCoupons(user, ['add-c2'])
    await user.type(screen.getByTestId('code-input'), 'SAVE10')
    await user.click(screen.getByTestId('apply-code'))
    expect(screen.getByTestId('applied-ok')).toBeInTheDocument()
    await user.click(screen.getByTestId('clear-coupon'))
    expect(screen.queryByTestId('applied-ok')).not.toBeInTheDocument()
  })

  it('becomes valid once the subtotal reaches the min spend', async () => {
    const user = userEvent.setup()
    render(<App />)
    // apply BIG20 with too-small cart, then add more to cross 50
    await addAndGoToCoupons(user, ['add-c1']) // 12
    await user.type(screen.getByTestId('code-input'), 'BIG20')
    await user.click(screen.getByTestId('apply-code'))
    expect(screen.getByTestId('applied-warn')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-cart'))
    await user.click(screen.getByTestId('add-c4')) // +45 => 57
    await user.click(screen.getByTestId('nav-coupons'))
    expect(screen.getByTestId('applied-ok')).toHaveTextContent('BIG20')
  })
})
