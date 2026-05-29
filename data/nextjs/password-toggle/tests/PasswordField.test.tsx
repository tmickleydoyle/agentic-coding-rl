import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PasswordField from '../components/PasswordField'

describe('PasswordField', () => {
  it('starts hidden (type=password) with Show label', () => {
    render(<PasswordField />)
    expect(screen.getByTestId('pw')).toHaveAttribute('type', 'password')
    expect(screen.getByTestId('toggle')).toHaveTextContent('Show')
  })

  it('clicking toggles to visible (type=text) with Hide label', async () => {
    const user = userEvent.setup()
    render(<PasswordField />)
    await user.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('pw')).toHaveAttribute('type', 'text')
    expect(screen.getByTestId('toggle')).toHaveTextContent('Hide')
  })

  it('toggles back to hidden on second click', async () => {
    const user = userEvent.setup()
    render(<PasswordField />)
    const btn = screen.getByTestId('toggle')
    await user.click(btn)
    await user.click(btn)
    expect(screen.getByTestId('pw')).toHaveAttribute('type', 'password')
    expect(btn).toHaveTextContent('Show')
  })
})
