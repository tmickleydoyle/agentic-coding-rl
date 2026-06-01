import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders schedule by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-schedule')).toBeInTheDocument()
    expect(screen.getByTestId('nav-schedule')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-speakers')).not.toHaveAttribute('aria-current')
  })

  it('navigates to my-agenda', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-agenda'))
    expect(screen.getByTestId('page-my-agenda')).toBeInTheDocument()
    expect(screen.getByTestId('nav-my-agenda')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to speakers', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-speakers'))
    expect(screen.getByTestId('page-speakers')).toBeInTheDocument()
  })

  it('navigates to session-detail and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-session-detail'))
    expect(screen.getByTestId('page-session-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('page-schedule')).toBeInTheDocument()
    expect(screen.getByTestId('nav-session-detail')).not.toHaveAttribute('aria-current')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
