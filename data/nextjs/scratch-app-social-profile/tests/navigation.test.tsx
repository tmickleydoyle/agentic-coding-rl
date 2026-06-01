import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the profile page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-profile')).toBeInTheDocument()
    expect(screen.getByTestId('nav-profile')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-posts')).not.toHaveAttribute('aria-current')
  })

  it('navigates to posts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-posts'))
    expect(screen.getByTestId('page-posts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-posts')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to connections', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    expect(screen.getByTestId('page-connections')).toBeInTheDocument()
  })

  it('navigates to edit then back to profile', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-edit'))
    expect(screen.getByTestId('page-edit')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-profile'))
    expect(screen.getByTestId('page-profile')).toBeInTheDocument()
    expect(screen.getByTestId('nav-edit')).not.toHaveAttribute('aria-current')
  })
})
