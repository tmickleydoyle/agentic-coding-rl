import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Base Converter', () => {
  it('renders the page title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /base converter/i })).toBeInTheDocument()
  })

  it('shows Input Value and From Base controls', () => {
    render(<App />)
    expect(screen.getByLabelText(/input value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from base/i)).toBeInTheDocument()
  })

  it('auto-converts seed data 42 decimal on mount', () => {
    render(<App />)
    expect(screen.getByTestId('result-binary').textContent).toBe('101010')
    expect(screen.getByTestId('result-octal').textContent).toBe('52')
    expect(screen.getByTestId('result-decimal').textContent).toBe('42')
    expect(screen.getByTestId('result-hex').textContent).toBe('2A')
  })

  it('converts FF from hex', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/input value/i)
    const select = screen.getByLabelText(/from base/i)
    await user.clear(input)
    await user.type(input, 'FF')
    await user.selectOptions(select, '16')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('result-binary').textContent).toBe('11111111')
    expect(screen.getByTestId('result-octal').textContent).toBe('377')
    expect(screen.getByTestId('result-decimal').textContent).toBe('255')
    expect(screen.getByTestId('result-hex').textContent).toBe('FF')
  })

  it('converts 1010 from binary', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/input value/i)
    const select = screen.getByLabelText(/from base/i)
    await user.clear(input)
    await user.type(input, '1010')
    await user.selectOptions(select, '2')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('result-binary').textContent).toBe('1010')
    expect(screen.getByTestId('result-octal').textContent).toBe('12')
    expect(screen.getByTestId('result-decimal').textContent).toBe('10')
    expect(screen.getByTestId('result-hex').textContent).toBe('A')
  })

  it('converts octal 77 to other bases', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/input value/i)
    const select = screen.getByLabelText(/from base/i)
    await user.clear(input)
    await user.type(input, '77')
    await user.selectOptions(select, '8')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('result-decimal').textContent).toBe('63')
    expect(screen.getByTestId('result-binary').textContent).toBe('111111')
    expect(screen.getByTestId('result-hex').textContent).toBe('3F')
  })

  it('shows error for invalid binary input', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/input value/i)
    const select = screen.getByLabelText(/from base/i)
    await user.clear(input)
    await user.type(input, '123')
    await user.selectOptions(select, '2')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
    expect(screen.getByTestId('error-message').textContent).toMatch(/invalid/i)
  })

  it('shows error for empty input', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/input value/i)
    await user.clear(input)
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
  })

  it('no error message on valid conversion', () => {
    render(<App />)
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
  })

  it('hex result is always uppercase', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/input value/i)
    await user.clear(input)
    await user.type(input, 'ff')
    await user.selectOptions(screen.getByLabelText(/from base/i), '16')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('result-hex').textContent).toBe('FF')
  })

  it('shows Convert button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })
})
