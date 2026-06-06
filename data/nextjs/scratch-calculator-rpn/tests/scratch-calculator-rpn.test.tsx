import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('RPN Calculator', () => {
  it('renders heading and token input', () => {
    render(<App />)
    expect(screen.getByText('RPN Calculator')).toBeInTheDocument()
    expect(screen.getByLabelText(/token/i)).toBeInTheDocument()
  })

  it('starts with empty stack depth 0', () => {
    render(<App />)
    expect(screen.getByTestId('stack-depth').textContent).toBe('0')
  })

  it('starts with no stack items', () => {
    render(<App />)
    expect(screen.queryAllByTestId('stack-item')).toHaveLength(0)
  })

  it('pushes a number onto the stack', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '42')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    expect(screen.getAllByTestId('stack-item')).toHaveLength(1)
    expect(screen.getByTestId('stack-depth').textContent).toBe('1')
    expect(screen.getByTestId('last-result').textContent).toBe('42')
  })

  it('adds number to history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '5')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(1)
  })

  it('evaluates addition correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '3')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '4')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '+')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    expect(screen.getByTestId('last-result').textContent).toBe('7')
    expect(screen.getByTestId('stack-depth').textContent).toBe('1')
  })

  it('evaluates division correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '10')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '2')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '/')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    expect(screen.getByTestId('last-result').textContent).toBe('5')
  })

  it('handles division by zero as error', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '5')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '0')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '/')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    expect(screen.getByTestId('last-result').textContent).toBe('Error')
    expect(screen.getByTestId('error-message').textContent).not.toBe('')
  })

  it('does not add history entry on division by zero', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '5')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '0')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '/')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    // Only 2 history entries (the two number pushes), not the division
    expect(screen.getAllByTestId('history-entry')).toHaveLength(2)
  })

  it('shows error for insufficient operands', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '5')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '+')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    expect(screen.getByTestId('error-message').textContent).not.toBe('')
    expect(screen.getByTestId('last-result').textContent).toBe('Error')
  })

  it('clear stack empties the stack', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '3')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.type(screen.getByLabelText(/token/i), '7')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.click(screen.getByRole('button', { name: /clear stack/i }))
    expect(screen.queryAllByTestId('stack-item')).toHaveLength(0)
    expect(screen.getByTestId('stack-depth').textContent).toBe('0')
  })

  it('clear history removes entries', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '3')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    await user.click(screen.getByRole('button', { name: /clear history/i }))
    expect(screen.queryAllByTestId('history-entry')).toHaveLength(0)
  })

  it('shows stack-top for topmost item', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), '9')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    expect(screen.getByTestId('stack-top').textContent).toBe('9')
  })

  it('rejects invalid token', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/token/i), 'abc')
    await user.click(screen.getByRole('button', { name: /^push$/i }))
    expect(screen.getByTestId('last-result').textContent).toBe('Error')
  })
})
