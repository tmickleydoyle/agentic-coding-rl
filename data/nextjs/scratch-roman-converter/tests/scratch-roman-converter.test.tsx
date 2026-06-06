import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Roman Numeral Converter', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByText('Roman Numeral Converter')).toBeInTheDocument()
  })

  it('defaults to Integer → Roman mode with integer input', () => {
    render(<App />)
    expect(screen.getByLabelText(/^integer$/i)).toBeInTheDocument()
  })

  it('converts integer to roman numeral', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^integer$/i), '2024')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('conversion-result').textContent).toBe('MMXXIV')
  })

  it('converts 1994 to MCMXCIV', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^integer$/i), '1994')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('conversion-result').textContent).toBe('MCMXCIV')
  })

  it('shows Invalid input for 0', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^integer$/i), '0')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('conversion-result').textContent).toBe('Invalid input')
  })

  it('shows Invalid input for 4000', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^integer$/i), '4000')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('conversion-result').textContent).toBe('Invalid input')
  })

  it('does not add history entry for invalid conversion', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^integer$/i), '0')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.queryAllByTestId('history-entry')).toHaveLength(0)
  })

  it('adds history entry for valid conversion', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^integer$/i), '4')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(1)
    expect(screen.getByTestId('history-entry').textContent).toContain('IV')
  })

  it('switches to Roman → Integer mode', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText(/roman → integer/i))
    expect(screen.getByLabelText(/roman numeral/i)).toBeInTheDocument()
  })

  it('converts roman numeral to integer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText(/roman → integer/i))
    await user.type(screen.getByLabelText(/roman numeral/i), 'XIV')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('conversion-result').textContent).toBe('14')
  })

  it('rejects invalid roman numeral characters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText(/roman → integer/i))
    await user.type(screen.getByLabelText(/roman numeral/i), 'ABC')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('conversion-result').textContent).toBe('Invalid input')
  })

  it('clears history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^integer$/i), '10')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: /clear history/i }))
    expect(screen.queryAllByTestId('history-entry')).toHaveLength(0)
  })

  it('switching mode clears result display', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^integer$/i), '5')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('conversion-result').textContent).toBe('V')
    await user.click(screen.getByLabelText(/roman → integer/i))
    expect(screen.getByTestId('conversion-result').textContent).toBe('—')
  })

  it('converts IV to 4', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText(/roman → integer/i))
    await user.type(screen.getByLabelText(/roman numeral/i), 'IV')
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('conversion-result').textContent).toBe('4')
  })
})
