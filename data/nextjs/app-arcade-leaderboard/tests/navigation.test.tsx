import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the games page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-games')).toBeInTheDocument()
    expect(screen.getByTestId('nav-games')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-rankings')).not.toHaveAttribute('aria-current')
  })

  it('navigates to submit', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-submit'))
    expect(screen.getByTestId('page-submit')).toBeInTheDocument()
    expect(screen.getByTestId('nav-submit')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to rankings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-rankings'))
    expect(screen.getByTestId('page-rankings')).toBeInTheDocument()
  })

  it('navigates to detail tab and shows no-game when none selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-game-detail'))
    expect(screen.getByTestId('no-game-selected')).toBeInTheDocument()
  })

  it('carries the theme onto the root element', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
