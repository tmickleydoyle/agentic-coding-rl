import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('pot detail allocate/withdraw', () => {
  it('allocates funds from the pool into the pot', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('pot-p1-open'))
    expect(screen.getByTestId('pool')).toHaveTextContent('1000')
    await user.type(screen.getByTestId('amount-input'), '500')
    await user.click(screen.getByTestId('allocate-button'))
    expect(screen.getByTestId('action-success')).toBeInTheDocument()
    // p1 balance 1500 -> 2000, pool 1000 -> 500
    expect(screen.getByTestId('pot-balance')).toHaveTextContent('2000')
    expect(screen.getByTestId('pool')).toHaveTextContent('500')

    await user.click(screen.getByTestId('nav-pots'))
    expect(screen.getByTestId('unallocated')).toHaveTextContent('500')
    expect(screen.getByTestId('pot-p1-balance')).toHaveTextContent('2000')
  })

  it('marks a pot as met once allocation reaches the goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('pot-p3-open'))
    expect(screen.getByTestId('goal-state')).toHaveTextContent('saving')
    // p3 needs 1000 to hit 1200 goal; pool is exactly 1000
    await user.type(screen.getByTestId('amount-input'), '1000')
    await user.click(screen.getByTestId('allocate-button'))
    expect(screen.getByTestId('goal-state')).toHaveTextContent('met')
    expect(screen.getByTestId('pot-progress')).toHaveTextContent('100')
  })

  it('rejects allocating more than the pool', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('pot-p1-open'))
    await user.type(screen.getByTestId('amount-input'), '5000')
    await user.click(screen.getByTestId('allocate-button'))
    expect(screen.getByTestId('action-error')).toHaveTextContent('insufficient funds')
    expect(screen.getByTestId('pot-balance')).toHaveTextContent('1500')
  })

  it('withdraws funds back to the pool', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('pot-p1-open'))
    await user.type(screen.getByTestId('amount-input'), '300')
    await user.click(screen.getByTestId('withdraw-button'))
    // p1 1500 -> 1200, pool 1000 -> 1300
    expect(screen.getByTestId('pot-balance')).toHaveTextContent('1200')
    expect(screen.getByTestId('pool')).toHaveTextContent('1300')
  })

  it('rejects withdrawing more than the pot balance', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('pot-p3-open'))
    await user.type(screen.getByTestId('amount-input'), '5000')
    await user.click(screen.getByTestId('withdraw-button'))
    expect(screen.getByTestId('action-error')).toHaveTextContent('insufficient balance')
  })

  it('rejects a non-positive amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('pot-p1-open'))
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.click(screen.getByTestId('allocate-button'))
    expect(screen.getByTestId('action-error')).toHaveTextContent('amount must be positive')
  })
})
