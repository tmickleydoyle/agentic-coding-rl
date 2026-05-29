import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../components/App'

describe('Theme via Context', () => {
  it('starts in light theme', () => {
    render(<App />)
    expect(screen.getByTestId('root')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByTestId('toggle')).toHaveTextContent('Switch to dark')
  })

  it('toggling switches theme via context', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('root')).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByTestId('toggle')).toHaveTextContent('Switch to light')
  })

  it('toggles back to light', async () => {
    const user = userEvent.setup()
    render(<App />)
    const btn = screen.getByTestId('toggle')
    await user.click(btn)
    await user.click(btn)
    expect(screen.getByTestId('root')).toHaveAttribute('data-theme', 'light')
    expect(btn).toHaveTextContent('Switch to dark')
  })
})
