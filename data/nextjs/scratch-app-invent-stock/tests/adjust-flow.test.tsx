import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openAdjust(user: ReturnType<typeof userEvent.setup>, viewTestId: string) {
  await user.click(screen.getByTestId(viewTestId))
  await user.click(screen.getByTestId('go-adjust'))
}

describe('adjust flow', () => {
  it('receives stock raising the quantity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAdjust(user, 'view-p1') // Widget qty 40
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '5')
    await user.click(screen.getByTestId('receive'))
    expect(screen.getByTestId('adjust-qty')).toHaveTextContent('45')
  })

  it('ships stock lowering the quantity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAdjust(user, 'view-p1')
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '10')
    await user.click(screen.getByTestId('ship'))
    expect(screen.getByTestId('adjust-qty')).toHaveTextContent('30')
  })

  it('never lets quantity go below zero', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAdjust(user, 'view-p2') // qty 5
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '20')
    await user.click(screen.getByTestId('ship'))
    expect(screen.getByTestId('adjust-qty')).toHaveTextContent('0')
  })

  it('reflects an adjustment back on the products list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAdjust(user, 'view-p1')
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '3')
    await user.click(screen.getByTestId('receive'))
    await user.click(screen.getByTestId('nav-products'))
    expect(screen.getByTestId('product-p1-qty')).toHaveTextContent('43')
  })

  it('shipping below reorder point flips the product to low', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAdjust(user, 'view-p1') // qty 40 reorder 10
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '35')
    await user.click(screen.getByTestId('ship')) // qty 5 <= 10
    await user.click(screen.getByTestId('nav-products'))
    expect(screen.getByTestId('product-p1')).toHaveAttribute('data-low', 'true')
  })

  it('raising the reorder point can flip a product to low', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAdjust(user, 'view-p1') // qty 40 reorder 10
    for (let i = 0; i < 1; i++) {
      await user.click(screen.getByTestId('raise-reorder'))
    }
    expect(screen.getByTestId('adjust-reorder')).toHaveTextContent('11')
  })
})
