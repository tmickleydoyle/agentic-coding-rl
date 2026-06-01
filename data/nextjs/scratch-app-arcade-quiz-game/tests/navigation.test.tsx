import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the categories page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-categories')).toBeInTheDocument()
    expect(screen.getByTestId('nav-categories')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-play')).not.toHaveAttribute('aria-current')
  })

  it('navigates to leaderboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-leaderboard'))
    expect(screen.getByTestId('page-leaderboard')).toBeInTheDocument()
  })

  it('navigates to results', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-results'))
    expect(screen.getByTestId('page-results')).toBeInTheDocument()
  })

  it('navigates to play', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-play'))
    expect(screen.getByTestId('page-play')).toBeInTheDocument()
  })

  it('lists category counts on the categories page', () => {
    render(<App />)
    expect(screen.getByTestId('cat-count-Geography')).toHaveTextContent('2')
    expect(screen.getByTestId('cat-count-Math')).toHaveTextContent('2')
  })
})
