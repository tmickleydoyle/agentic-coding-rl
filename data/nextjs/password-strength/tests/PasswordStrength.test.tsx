import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PasswordStrength from '../components/PasswordStrength'

describe('PasswordStrength', () => {
  it('shows empty label initially', () => {
    render(<PasswordStrength />)
    expect(screen.getByTestId('strength-label')).toHaveTextContent('')
  })

  it('shows Weak for single lowercase letter', async () => {
    const user = userEvent.setup()
    render(<PasswordStrength />)
    await user.type(screen.getByTestId('password-input'), 'a')
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Weak')
  })

  it('shows Fair for 2 criteria (long + uppercase)', async () => {
    const user = userEvent.setup()
    render(<PasswordStrength />)
    await user.type(screen.getByTestId('password-input'), 'Abcdefgh')
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Fair')
  })

  it('shows Good for 3 criteria (long + uppercase + number)', async () => {
    const user = userEvent.setup()
    render(<PasswordStrength />)
    await user.type(screen.getByTestId('password-input'), 'Abcdefg1')
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Good')
  })

  it('shows Strong for all 4 criteria', async () => {
    const user = userEvent.setup()
    render(<PasswordStrength />)
    await user.type(screen.getByTestId('password-input'), 'Abcdef1!')
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Strong')
  })

  it('short password with uppercase only shows Weak', async () => {
    const user = userEvent.setup()
    render(<PasswordStrength />)
    await user.type(screen.getByTestId('password-input'), 'A')
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Weak')
  })

  it('updates strength as more criteria are met', async () => {
    const user = userEvent.setup()
    render(<PasswordStrength />)
    const input = screen.getByTestId('password-input')
    await user.type(input, 'abc')
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Weak')
    await user.clear(input)
    await user.type(input, 'Abcdefg1!')
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Strong')
  })
})
