import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ToggleSwitch from '../components/ToggleSwitch'

describe('ToggleSwitch', () => {
  it('renders in OFF state initially', () => {
    render(<ToggleSwitch />)
    expect(screen.getByTestId('toggle-label')).toHaveTextContent('OFF')
  })

  it('toggle starts with aria-checked false', () => {
    render(<ToggleSwitch />)
    expect(screen.getByTestId('toggle')).toHaveAttribute('aria-checked', 'false')
  })

  it('switches to ON after one click', async () => {
    const user = userEvent.setup()
    render(<ToggleSwitch />)
    await user.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('toggle-label')).toHaveTextContent('ON')
  })

  it('toggle has aria-checked true after click', async () => {
    const user = userEvent.setup()
    render(<ToggleSwitch />)
    await user.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('toggle')).toHaveAttribute('aria-checked', 'true')
  })

  it('switches back to OFF after two clicks', async () => {
    const user = userEvent.setup()
    render(<ToggleSwitch />)
    await user.click(screen.getByTestId('toggle'))
    await user.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('toggle-label')).toHaveTextContent('OFF')
  })

  it('aria-checked returns to false after two clicks', async () => {
    const user = userEvent.setup()
    render(<ToggleSwitch />)
    await user.click(screen.getByTestId('toggle'))
    await user.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('toggle')).toHaveAttribute('aria-checked', 'false')
  })
})
