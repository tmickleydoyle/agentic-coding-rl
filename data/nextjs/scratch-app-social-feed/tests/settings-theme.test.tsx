import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('theme + state persistence', () => {
  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('persists a like across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('like-p1'))
    expect(screen.getByTestId('post-p1-likes')).toHaveTextContent('4')
    await user.click(screen.getByTestId('nav-explore'))
    await user.click(screen.getByTestId('nav-feed'))
    expect(screen.getByTestId('post-p1-likes')).toHaveTextContent('4')
  })

  it('persists a follow change across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-explore'))
    await user.click(screen.getByTestId('follow-u3'))
    await user.click(screen.getByTestId('nav-feed'))
    await user.click(screen.getByTestId('nav-explore'))
    expect(screen.getByTestId('follow-u3')).toHaveTextContent('Following')
  })
})
