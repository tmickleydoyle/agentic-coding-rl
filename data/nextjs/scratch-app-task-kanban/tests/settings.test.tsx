import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('settings', () => {
  it('defaults to light theme reflected on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles the theme to dark and reflects it on the root', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('persists the theme across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('theme-toggle'))
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('shows the default WIP limit of 3', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('current-wip')).toHaveTextContent('3')
  })

  it('updates and persists the WIP limit', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.clear(screen.getByTestId('wip-input'))
    await user.type(screen.getByTestId('wip-input'), '5')
    await user.click(screen.getByTestId('wip-save'))
    expect(screen.getByTestId('current-wip')).toHaveTextContent('5')
    await user.click(screen.getByTestId('nav-board'))
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('current-wip')).toHaveTextContent('5')
  })
})
