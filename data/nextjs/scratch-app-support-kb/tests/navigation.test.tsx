import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the articles page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-articles')).toBeInTheDocument()
    expect(screen.getByTestId('nav-articles')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-search')).not.toHaveAttribute('aria-current')
  })

  it('navigates to categories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('page-categories')).toBeInTheDocument()
    expect(screen.getByTestId('nav-categories')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to search and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('page-search')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-articles'))
    expect(screen.getByTestId('page-articles')).toBeInTheDocument()
    expect(screen.getByTestId('nav-search')).not.toHaveAttribute('aria-current')
  })

  it('exposes the theme on the app root and defaults to light', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
