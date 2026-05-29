import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeSwitch from '../components/ThemeSwitch'

describe('ThemeSwitch', () => {
  it('starts in light theme with the right button label', () => {
    render(<ThemeSwitch />)
    expect(screen.getByTestId('root')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByTestId('toggle')).toHaveTextContent('Switch to dark')
  })

  it('switches to dark on click', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitch />)
    await user.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('root')).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByTestId('toggle')).toHaveTextContent('Switch to light')
  })

  it('switches back to light on second click', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitch />)
    const btn = screen.getByTestId('toggle')
    await user.click(btn)
    await user.click(btn)
    expect(screen.getByTestId('root')).toHaveAttribute('data-theme', 'light')
    expect(btn).toHaveTextContent('Switch to dark')
  })
})
