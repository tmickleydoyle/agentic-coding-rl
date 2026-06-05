import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function type(u: ReturnType<typeof userEvent.setup>, text: string) {
  const input = screen.getByLabelText(/^password$/i)
  await u.clear(input)
  if (text) await u.type(input, text)
}

function ruleItem(label: string): HTMLElement {
  return screen.getByText(label).closest('li') as HTMLElement
}

describe('Password Strength Checker', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /password strength checker/i })).toBeInTheDocument()
  })

  it('renders a Password input', () => {
    render(<App />)
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
  })

  it('shows all four rule labels', () => {
    render(<App />)
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
    expect(screen.getByText('Contains a number')).toBeInTheDocument()
    expect(screen.getByText('Contains a symbol')).toBeInTheDocument()
    expect(screen.getByText('Contains uppercase and lowercase')).toBeInTheDocument()
  })

  it('shows Strength: Weak when input is empty', () => {
    render(<App />)
    expect(screen.getByText('Strength: Weak')).toBeInTheDocument()
  })

  it('all rules fail initially', () => {
    render(<App />)
    expect(ruleItem('At least 8 characters')).toHaveAttribute('aria-label', 'fail')
    expect(ruleItem('Contains a number')).toHaveAttribute('aria-label', 'fail')
    expect(ruleItem('Contains a symbol')).toHaveAttribute('aria-label', 'fail')
    expect(ruleItem('Contains uppercase and lowercase')).toHaveAttribute('aria-label', 'fail')
  })

  it('passes the length rule for 8+ character password', async () => {
    const u = userEvent.setup()
    render(<App />)
    await type(u, 'abcdefgh')
    expect(ruleItem('At least 8 characters')).toHaveAttribute('aria-label', 'pass')
  })

  it('fails the length rule for a short password', async () => {
    const u = userEvent.setup()
    render(<App />)
    await type(u, 'abc')
    expect(ruleItem('At least 8 characters')).toHaveAttribute('aria-label', 'fail')
  })

  it('passes the number rule when a digit is present', async () => {
    const u = userEvent.setup()
    render(<App />)
    await type(u, 'abc1')
    expect(ruleItem('Contains a number')).toHaveAttribute('aria-label', 'pass')
  })

  it('passes the symbol rule when a symbol is present', async () => {
    const u = userEvent.setup()
    render(<App />)
    await type(u, 'abc!')
    expect(ruleItem('Contains a symbol')).toHaveAttribute('aria-label', 'pass')
  })

  it('fails the symbol rule when only letters and numbers are present', async () => {
    const u = userEvent.setup()
    render(<App />)
    await type(u, 'abc123')
    expect(ruleItem('Contains a symbol')).toHaveAttribute('aria-label', 'fail')
  })

  it('passes the mixed case rule with both upper and lower', async () => {
    const u = userEvent.setup()
    render(<App />)
    await type(u, 'Abc')
    expect(ruleItem('Contains uppercase and lowercase')).toHaveAttribute('aria-label', 'pass')
  })

  it('fails the mixed case rule with only lowercase', async () => {
    const u = userEvent.setup()
    render(<App />)
    await type(u, 'abcdef')
    expect(ruleItem('Contains uppercase and lowercase')).toHaveAttribute('aria-label', 'fail')
  })

  it('shows Strength: Medium for 2 passing rules', async () => {
    const u = userEvent.setup()
    render(<App />)
    // length (8+) and number pass; no symbol, no mixed case
    await type(u, 'abcdefg1')
    expect(screen.getByText('Strength: Medium')).toBeInTheDocument()
  })

  it('shows Strength: Medium for 3 passing rules', async () => {
    const u = userEvent.setup()
    render(<App />)
    // length, number, mixed case pass; no symbol
    await type(u, 'Abcdefg1')
    expect(screen.getByText('Strength: Medium')).toBeInTheDocument()
  })

  it('shows Strength: Strong when all 4 rules pass', async () => {
    const u = userEvent.setup()
    render(<App />)
    await type(u, 'Abcdef1!')
    expect(screen.getByText('Strength: Strong')).toBeInTheDocument()
    expect(ruleItem('At least 8 characters')).toHaveAttribute('aria-label', 'pass')
    expect(ruleItem('Contains a number')).toHaveAttribute('aria-label', 'pass')
    expect(ruleItem('Contains a symbol')).toHaveAttribute('aria-label', 'pass')
    expect(ruleItem('Contains uppercase and lowercase')).toHaveAttribute('aria-label', 'pass')
  })

  it('goes back to Weak when the input is cleared', async () => {
    const u = userEvent.setup()
    render(<App />)
    await type(u, 'Abcdef1!')
    expect(screen.getByText('Strength: Strong')).toBeInTheDocument()
    await type(u, '')
    expect(screen.getByText('Strength: Weak')).toBeInTheDocument()
  })

  it('shows Strength: Weak for exactly 1 passing rule', async () => {
    const u = userEvent.setup()
    render(<App />)
    // only number rule passes
    await type(u, '1')
    expect(screen.getByText('Strength: Weak')).toBeInTheDocument()
  })
})
