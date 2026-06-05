import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('settings + scores', () => {
  it('switches to an easy 4-card deck', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('pair-count')).toHaveTextContent('4')
    await user.click(screen.getByTestId('set-easy'))
    expect(screen.getByTestId('pair-count')).toHaveTextContent('2')
    await user.click(screen.getByTestId('nav-play'))
    expect(screen.getByTestId('board').querySelectorAll('button').length).toBe(4)
  })

  it('switches to a hard 12-card deck', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('set-hard'))
    await user.click(screen.getByTestId('nav-play'))
    expect(screen.getByTestId('board').querySelectorAll('button').length).toBe(12)
  })

  it('toggles the theme on the root element', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('toggle-theme'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('scores page shows a dash before any best, and reset-best clears it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-scores'))
    expect(screen.getByTestId('best')).toHaveTextContent('-')
    await user.click(screen.getByTestId('reset-best'))
    expect(screen.getByTestId('best')).toHaveTextContent('-')
  })
})
