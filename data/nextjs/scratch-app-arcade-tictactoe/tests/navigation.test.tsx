import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the play page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-play')).toBeInTheDocument()
    expect(screen.getByTestId('nav-play')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-scores')).not.toHaveAttribute('aria-current')
  })

  it('navigates to scores', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-scores'))
    expect(screen.getByTestId('page-scores')).toBeInTheDocument()
  })

  it('navigates to settings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
  })

  it('navigates to how-to and shows the rules', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-how-to'))
    expect(screen.getByTestId('rules-intro')).toBeInTheDocument()
    expect(screen.getByTestId('rules').querySelectorAll('li').length).toBeGreaterThanOrEqual(3)
  })

  it('starts on an empty board with a your-turn status', () => {
    render(<App />)
    expect(screen.getByTestId('status')).toHaveTextContent('Your turn')
    for (let i = 0; i < 9; i++) {
      expect(screen.getByTestId(`cell-${i}`)).toHaveTextContent('')
    }
  })
})
