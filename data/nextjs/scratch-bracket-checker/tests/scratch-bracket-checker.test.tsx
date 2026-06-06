import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Bracket Checker', () => {
  it('renders heading and textarea', () => {
    render(<App />)
    expect(screen.getByText('Bracket Checker')).toBeInTheDocument()
    expect(screen.getByLabelText(/expression/i)).toBeInTheDocument()
  })

  it('shows char-count and bracket-count of 0 initially', () => {
    render(<App />)
    expect(screen.getByTestId('char-count').textContent).toBe('0')
    expect(screen.getByTestId('bracket-count').textContent).toBe('0')
  })

  it('updates char-count as user types', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), 'hello')
    expect(screen.getByTestId('char-count').textContent).toBe('5')
  })

  it('counts only bracket characters in bracket-count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), 'a(b)c')
    expect(screen.getByTestId('char-count').textContent).toBe('5')
    expect(screen.getByTestId('bracket-count').textContent).toBe('2')
  })

  it('valid balanced brackets shows Valid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), '([])')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('check-result').textContent).toBe('Valid')
  })

  it('empty string is Valid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('check-result').textContent).toBe('Valid')
  })

  it('detects unexpected closing bracket', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), ']')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('check-result').textContent).toContain('unexpected closing bracket at position 1')
  })

  it('detects unclosed opening bracket', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), '(((')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('check-result').textContent).toContain('unclosed opening bracket at position 1')
  })

  it('detects mismatched bracket', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), '([)]')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('check-result').textContent).toContain('mismatched bracket at position 3')
  })

  it('non-bracket characters are ignored in validation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), 'hello (world)')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('check-result').textContent).toBe('Valid')
  })

  it('adds history entry for each check', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), '()')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(2)
  })

  it('adds history entry even for invalid expressions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), ']')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(1)
  })

  it('clear history removes all entries', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), '()')
    await user.click(screen.getByRole('button', { name: /check/i }))
    await user.click(screen.getByRole('button', { name: /clear history/i }))
    expect(screen.queryAllByTestId('history-entry')).toHaveLength(0)
  })

  it('clear history does not reset result', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/expression/i), '()')
    await user.click(screen.getByRole('button', { name: /check/i }))
    await user.click(screen.getByRole('button', { name: /clear history/i }))
    expect(screen.getByTestId('check-result').textContent).toBe('Valid')
  })
})
