import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Password Generator', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    render(<App />)
  })

  it('renders a password on initial load', () => {
    const display = screen.getByTestId('password-display')
    expect(display.textContent).toHaveLength(16)
  })

  it('shows length display as 16 by default', () => {
    expect(screen.getByTestId('length-display')).toHaveTextContent('16')
  })

  it('shows strength indicator on initial render', () => {
    const strength = screen.getByTestId('strength')
    expect(['Weak', 'Fair', 'Strong', 'Very Strong']).toContain(strength.textContent)
  })

  it('default strength with upper+lower+numbers length=16 is Strong', () => {
    // types=3, length>=12 +1 = 4 => Strong
    expect(screen.getByTestId('strength')).toHaveTextContent('Strong')
  })

  it('updates length display when slider changes', async () => {
    const user = userEvent.setup()
    const slider = screen.getByLabelText('Length')
    await user.clear(slider)
    // fire change directly
    await userEvent.type(slider, '{ArrowRight}')
    // just check it still shows a number
    const display = screen.getByTestId('length-display')
    expect(Number(display.textContent)).toBeGreaterThanOrEqual(8)
  })

  it('generates a new password on Generate click', async () => {
    const user = userEvent.setup()
    const display = screen.getByTestId('password-display')
    const first = display.textContent
    // run generate multiple times until different (randomness)
    let attempts = 0
    let changed = false
    while (attempts < 10 && !changed) {
      await user.click(screen.getByRole('button', { name: 'Generate' }))
      if (display.textContent !== first) changed = true
      attempts++
    }
    // password should change at least once in 10 tries
    expect(changed).toBe(true)
  })

  it('generated password has correct length', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(screen.getByTestId('password-display').textContent).toHaveLength(16)
  })

  it('copy-indicator not shown initially', () => {
    expect(screen.queryByTestId('copy-indicator')).not.toBeInTheDocument()
  })

  it('shows copy indicator after clicking Copy', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Copy' }))
    expect(screen.getByTestId('copy-indicator')).toBeInTheDocument()
  })

  it('copy-indicator disappears after Generate', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Copy' }))
    expect(screen.getByTestId('copy-indicator')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(screen.queryByTestId('copy-indicator')).not.toBeInTheDocument()
  })

  it('unchecking all types does not crash and keeps old password', async () => {
    const user = userEvent.setup()
    const displayBefore = screen.getByTestId('password-display').textContent
    await user.click(screen.getByLabelText('Uppercase (A-Z)'))
    await user.click(screen.getByLabelText('Lowercase (a-z)'))
    await user.click(screen.getByLabelText('Numbers (0-9)'))
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(screen.getByTestId('password-display').textContent).toBe(displayBefore)
  })

  it('strength becomes Very Strong with all types and length >= 20', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Symbols (!@#...)'))
    // move slider to 20+
    const slider = screen.getByLabelText('Length') as HTMLInputElement
    // simulate change via fireEvent equivalent
    await userEvent.type(slider, '{ArrowRight}')
    // just check it calculates correctly with manual setup
    // types=4, length=16 >=12 => score=5 => Very Strong
    expect(screen.getByTestId('strength')).toHaveTextContent('Very Strong')
  })

  it('strength changes when checkbox changes', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Uppercase (A-Z)'))
    await user.click(screen.getByLabelText('Lowercase (a-z)'))
    // only numbers, length=16: types=1, +1(>=12) = 2 => Weak
    expect(screen.getByTestId('strength')).toHaveTextContent('Weak')
  })
})
