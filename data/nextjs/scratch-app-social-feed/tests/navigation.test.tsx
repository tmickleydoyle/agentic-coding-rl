import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the feed by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-feed')).toBeInTheDocument()
    expect(screen.getByTestId('nav-feed')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-explore')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the explore page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-explore'))
    expect(screen.getByTestId('page-explore')).toBeInTheDocument()
    expect(screen.getByTestId('nav-explore')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-feed')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the profile page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-profile'))
    expect(screen.getByTestId('page-profile')).toBeInTheDocument()
    expect(screen.getByTestId('nav-profile')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to post then back to feed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-post'))
    expect(screen.getByTestId('page-post')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-feed'))
    expect(screen.getByTestId('page-feed')).toBeInTheDocument()
    expect(screen.getByTestId('nav-post')).not.toHaveAttribute('aria-current')
  })
})
