import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders courses by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-courses')).toBeInTheDocument()
    expect(screen.getByTestId('nav-courses')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-progress')).not.toHaveAttribute('aria-current')
  })

  it('navigates to player and progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-player'))
    expect(screen.getByTestId('page-player')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-progress'))
    expect(screen.getByTestId('page-progress')).toBeInTheDocument()
    expect(screen.getByTestId('nav-player')).not.toHaveAttribute('aria-current')
  })

  it('shows no-course on detail before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-course-detail'))
    expect(screen.getByTestId('no-course')).toBeInTheDocument()
  })

  it('shows no-lesson on the player before playing one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-player'))
    expect(screen.getByTestId('no-lesson')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
