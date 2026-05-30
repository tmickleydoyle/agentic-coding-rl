import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the posts page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-posts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-posts')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-moderation')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the moderation page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-moderation'))
    expect(screen.getByTestId('page-moderation')).toBeInTheDocument()
    expect(screen.getByTestId('nav-moderation')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to posts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-posts'))
    expect(screen.getByTestId('page-posts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })

  it('opens a post detail view from the posts list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    expect(screen.getByTestId('page-post-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Getting Started')
  })
})
