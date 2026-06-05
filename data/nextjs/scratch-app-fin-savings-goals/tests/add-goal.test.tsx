import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add goal flow', () => {
  it('blocks submitting with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-goal'))
    await user.type(screen.getByTestId('target-input'), '500')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-goal')).toBeInTheDocument()
  })

  it('blocks submitting with a non-positive target', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-goal'))
    await user.type(screen.getByTestId('name-input'), 'Car')
    await user.type(screen.getByTestId('target-input'), '0')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a goal and navigates to the goals list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-goal'))
    await user.type(screen.getByTestId('name-input'), 'House Deposit')
    await user.type(screen.getByTestId('target-input'), '20000')
    await user.type(screen.getByTestId('monthly-input'), '500')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('page-goals')).toBeInTheDocument()
    expect(within(screen.getByTestId('goal-list')).getByText('House Deposit')).toBeInTheDocument()
    expect(screen.getByTestId('goal-g4-percent')).toHaveTextContent('0')
  })

  it('updates totals after adding a goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-goal'))
    await user.type(screen.getByTestId('name-input'), 'Phone')
    await user.type(screen.getByTestId('target-input'), '1000')
    await user.click(screen.getByTestId('submit-goal'))
    // target total now 16000, saved unchanged 7500
    expect(screen.getByTestId('stat-target-value')).toHaveTextContent('16000')
    expect(screen.getByTestId('stat-saved-value')).toHaveTextContent('7500')
  })
})
