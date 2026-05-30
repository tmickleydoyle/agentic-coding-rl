import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today flow', () => {
  it('shows the seeded today total, goal, percent and remaining', () => {
    render(<App />)
    expect(screen.getByTestId('today-total')).toHaveTextContent('250')
    expect(screen.getByTestId('today-goal')).toHaveTextContent('2000')
    expect(screen.getByTestId('today-percent')).toHaveTextContent('13')
    expect(screen.getByTestId('today-remaining')).toHaveTextContent('1750')
    expect(screen.getByTestId('today-met')).toHaveAttribute('data-met', 'false')
  })

  it('lists only today drinks in the drink list', () => {
    render(<App />)
    // d3 is today; d1/d2 are 2026-05-27
    expect(screen.getByTestId('drink-d3')).toBeInTheDocument()
    expect(screen.queryByTestId('drink-d1')).not.toBeInTheDocument()
  })

  it('quick-adds 500 ml and updates the total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('quick-500'))
    expect(screen.getByTestId('today-total')).toHaveTextContent('750')
  })

  it('quick-add creates a new drink row with id d4', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('quick-250'))
    expect(screen.getByTestId('drink-d4')).toBeInTheDocument()
    expect(screen.getByTestId('drink-d4-amount')).toHaveTextContent('250')
  })

  it('blocks adding an invalid custom amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('amount-input'), '-5')
    await user.click(screen.getByTestId('submit-drink'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('today-total')).toHaveTextContent('250')
  })

  it('adds a custom amount toward the total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('amount-input'), '300')
    await user.click(screen.getByTestId('submit-drink'))
    expect(screen.getByTestId('today-total')).toHaveTextContent('550')
  })

  it('marks the goal met and caps percent at 100', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('amount-input'), '2000')
    await user.click(screen.getByTestId('submit-drink'))
    expect(screen.getByTestId('today-percent')).toHaveTextContent('100')
    expect(screen.getByTestId('today-met')).toHaveAttribute('data-met', 'true')
  })

  it('removes a today drink and updates the total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('remove-d3'))
    expect(screen.queryByTestId('drink-d3')).not.toBeInTheDocument()
    expect(screen.getByTestId('today-total')).toHaveTextContent('0')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })
})
