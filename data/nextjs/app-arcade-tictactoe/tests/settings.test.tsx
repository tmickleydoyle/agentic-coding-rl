import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('settings', () => {
  it('toggles the theme on the root element', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('toggle-theme'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('toggles AI-starts and makes the AI open the next game', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('toggle-ai-starts')).toHaveTextContent('off')
    await user.click(screen.getByTestId('toggle-ai-starts'))
    expect(screen.getByTestId('toggle-ai-starts')).toHaveTextContent('on')
    await user.click(screen.getByTestId('nav-play'))
    await user.click(screen.getByTestId('reset'))
    // AI opens at the center
    expect(screen.getByTestId('cell-4')).toHaveTextContent('O')
  })
})
