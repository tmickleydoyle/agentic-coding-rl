import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DarkModeToggle from '../components/DarkModeToggle'

describe('DarkModeToggle', () => {
  it('starts in light mode', () => {
    render(<DarkModeToggle />)
    expect(screen.getByTestId('container')).toHaveAttribute('data-theme', 'light')
  })

  it('shows Light Mode button text initially', () => {
    render(<DarkModeToggle />)
    expect(screen.getByTestId('toggle-btn')).toHaveTextContent('Light Mode')
  })

  it('shows Current: Light label initially', () => {
    render(<DarkModeToggle />)
    expect(screen.getByTestId('mode-label')).toHaveTextContent('Current: Light')
  })

  it('switches to dark mode on click', async () => {
    const user = userEvent.setup()
    render(<DarkModeToggle />)
    await user.click(screen.getByTestId('toggle-btn'))
    expect(screen.getByTestId('container')).toHaveAttribute('data-theme', 'dark')
  })

  it('updates label to Current: Dark after toggle', async () => {
    const user = userEvent.setup()
    render(<DarkModeToggle />)
    await user.click(screen.getByTestId('toggle-btn'))
    expect(screen.getByTestId('mode-label')).toHaveTextContent('Current: Dark')
  })

  it('updates button text to Dark Mode after toggle', async () => {
    const user = userEvent.setup()
    render(<DarkModeToggle />)
    await user.click(screen.getByTestId('toggle-btn'))
    expect(screen.getByTestId('toggle-btn')).toHaveTextContent('Dark Mode')
  })

  it('toggles back to light on second click', async () => {
    const user = userEvent.setup()
    render(<DarkModeToggle />)
    await user.click(screen.getByTestId('toggle-btn'))
    await user.click(screen.getByTestId('toggle-btn'))
    expect(screen.getByTestId('container')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByTestId('mode-label')).toHaveTextContent('Current: Light')
  })
})
