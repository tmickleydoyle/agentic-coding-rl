import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupForm from '../components/SignupForm'

describe('SignupForm', () => {
  it('shows no errors and no status before submit', () => {
    render(<SignupForm />)
    expect(screen.queryByTestId('email-error')).toBeNull()
    expect(screen.queryByTestId('password-error')).toBeNull()
    expect(screen.getByTestId('status')).toHaveTextContent('')
  })

  it('shows both errors when both fields are invalid', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)
    await user.type(screen.getByTestId('email'), 'notanemail')
    await user.type(screen.getByTestId('password'), 'short')
    await user.click(screen.getByTestId('submit'))
    expect(screen.getByTestId('email-error')).toHaveTextContent('Email must contain @ and .')
    expect(screen.getByTestId('password-error')).toHaveTextContent(
      'Password must be at least 8 characters.'
    )
    expect(screen.getByTestId('status')).toHaveTextContent('Please fix the errors above.')
  })

  it('shows only the password error when email is valid but password is short', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)
    await user.type(screen.getByTestId('email'), 'a@b.co')
    await user.type(screen.getByTestId('password'), '1234')
    await user.click(screen.getByTestId('submit'))
    expect(screen.queryByTestId('email-error')).toBeNull()
    expect(screen.getByTestId('password-error')).toBeInTheDocument()
  })

  it('shows "Submitted!" when both fields are valid', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)
    await user.type(screen.getByTestId('email'), 'ada@lovelace.org')
    await user.type(screen.getByTestId('password'), 'analytical-engine')
    await user.click(screen.getByTestId('submit'))
    expect(screen.queryByTestId('email-error')).toBeNull()
    expect(screen.queryByTestId('password-error')).toBeNull()
    expect(screen.getByTestId('status')).toHaveTextContent('Submitted!')
  })
})
