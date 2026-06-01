import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add bill flow', () => {
  it('blocks submitting with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('amount-input'), '50')
    await user.type(screen.getByTestId('dueday-input'), '12')
    await user.click(screen.getByTestId('submit-bill'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks an out-of-range due day', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Water')
    await user.type(screen.getByTestId('amount-input'), '40')
    await user.type(screen.getByTestId('dueday-input'), '40')
    await user.click(screen.getByTestId('submit-bill'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('blocks a non-positive amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Water')
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.type(screen.getByTestId('dueday-input'), '12')
    await user.click(screen.getByTestId('submit-bill'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a bill and returns to the bills list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Water')
    await user.type(screen.getByTestId('amount-input'), '40')
    await user.type(screen.getByTestId('dueday-input'), '12')
    await user.click(screen.getByTestId('autopay-checkbox'))
    await user.click(screen.getByTestId('submit-bill'))
    expect(screen.getByTestId('page-bills')).toBeInTheDocument()
    expect(screen.getByTestId('bill-b5-name')).toHaveTextContent('Water')
    // due 12 >= today 10 and unpaid => upcoming
    expect(screen.getByTestId('bill-b5-status')).toHaveTextContent('upcoming')
    // autopay count goes 2 -> 3
    expect(screen.getByTestId('stat-autopay-value')).toHaveTextContent('3')
  })
})
