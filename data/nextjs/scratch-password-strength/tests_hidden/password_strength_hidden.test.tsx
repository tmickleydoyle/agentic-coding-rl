// HELD-OUT generalization tests — only overlaid at eval, never shown to the agent.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function typePassword(u: ReturnType<typeof userEvent.setup>, text: string) {
  const input = screen.getByLabelText(/^password$/i)
  await u.clear(input)
  if (text) await u.type(input, text)
}

function ruleItem(label: string): HTMLElement {
  return screen.getByText(label).closest('li') as HTMLElement
}

describe('Password Strength Checker (held-out)', () => {
  it('input is of type password', () => {
    render(<App />)
    const input = screen.getByLabelText(/^password$/i) as HTMLInputElement
    expect(input.type).toBe('password')
  })

  it('space character counts as a symbol', async () => {
    const u = userEvent.setup()
    render(<App />)
    await typePassword(u, 'abc def')
    expect(ruleItem('Contains a symbol')).toHaveAttribute('aria-label', 'pass')
  })

  it('exactly 8 characters satisfies the length rule', async () => {
    const u = userEvent.setup()
    render(<App />)
    await typePassword(u, '12345678')
    expect(ruleItem('At least 8 characters')).toHaveAttribute('aria-label', 'pass')
  })

  it('7 characters does not satisfy the length rule', async () => {
    const u = userEvent.setup()
    render(<App />)
    await typePassword(u, '1234567')
    expect(ruleItem('At least 8 characters')).toHaveAttribute('aria-label', 'fail')
  })

  it('only uppercase letters does not satisfy mixed case rule', async () => {
    const u = userEvent.setup()
    render(<App />)
    await typePassword(u, 'ABCDEF')
    expect(ruleItem('Contains uppercase and lowercase')).toHaveAttribute('aria-label', 'fail')
  })

  it('shows Strength: Weak for password with only symbols', async () => {
    const u = userEvent.setup()
    render(<App />)
    // only 1 rule passes (symbol)
    await typePassword(u, '!@#')
    expect(screen.getByText('Strength: Weak')).toBeInTheDocument()
  })

  it('shows Strength: Medium for exactly 2 rules passing with different combo', async () => {
    const u = userEvent.setup()
    render(<App />)
    // symbol + number, no length, no mixed case
    await typePassword(u, '1!')
    expect(screen.getByText('Strength: Medium')).toBeInTheDocument()
  })

  it('all rules still fail for an all-digit short password', async () => {
    const u = userEvent.setup()
    render(<App />)
    await typePassword(u, '42')
    expect(ruleItem('At least 8 characters')).toHaveAttribute('aria-label', 'fail')
    expect(ruleItem('Contains a symbol')).toHaveAttribute('aria-label', 'fail')
    expect(ruleItem('Contains uppercase and lowercase')).toHaveAttribute('aria-label', 'fail')
    // number rule should pass
    expect(ruleItem('Contains a number')).toHaveAttribute('aria-label', 'pass')
  })

  it('a long all-lowercase password is Medium (length + number rules vary)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // length passes, nothing else — Weak (only 1 rule)
    await typePassword(u, 'abcdefgh')
    expect(screen.getByText('Strength: Weak')).toBeInTheDocument()
  })

  it('strength updates dynamically as characters are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/^password$/i)
    await u.type(input, 'a')
    expect(screen.getByText('Strength: Weak')).toBeInTheDocument()
    await u.type(input, 'bcdefg1')
    // now: 'abcdefg1' — length (8) + number => 2 rules => Medium
    expect(screen.getByText('Strength: Medium')).toBeInTheDocument()
    await u.type(input, '!')
    // 'abcdefg1!' — length + number + symbol => 3 rules => Medium
    expect(screen.getByText('Strength: Medium')).toBeInTheDocument()
    await u.type(input, 'A')
    // 'abcdefg1!A' — all 4 rules => Strong
    expect(screen.getByText('Strength: Strong')).toBeInTheDocument()
  })
})
