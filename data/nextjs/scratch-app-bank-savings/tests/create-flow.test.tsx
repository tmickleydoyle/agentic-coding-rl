import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('create pot flow', () => {
  it('blocks submitting with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('goal-input'), '500')
    await user.click(screen.getByTestId('submit-pot'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
  })

  it('blocks a negative goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('name-input'), 'Car')
    await user.type(screen.getByTestId('goal-input'), '-10')
    await user.click(screen.getByTestId('submit-pot'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('creates a pot and returns to the pots list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('name-input'), 'Car')
    await user.type(screen.getByTestId('goal-input'), '5000')
    await user.click(screen.getByTestId('submit-pot'))
    expect(screen.getByTestId('page-pots')).toBeInTheDocument()
    expect(screen.getByTestId('pot-p4-name')).toHaveTextContent('Car')
    // new pot starts at balance 0 => progress 0
    expect(screen.getByTestId('pot-p4-balance')).toHaveTextContent('0')
    expect(screen.getByTestId('pot-p4-progress')).toHaveTextContent('0')
    // pot count goes 3 -> 4
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('4')
  })
})
