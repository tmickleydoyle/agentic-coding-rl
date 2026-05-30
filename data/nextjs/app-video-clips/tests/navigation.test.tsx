import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders feed by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-feed')).toBeInTheDocument()
    expect(screen.getByTestId('nav-feed')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-saved')).not.toHaveAttribute('aria-current')
  })

  it('navigates to saved and categories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-saved'))
    expect(screen.getByTestId('page-saved')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('page-categories')).toBeInTheDocument()
    expect(screen.getByTestId('nav-saved')).not.toHaveAttribute('aria-current')
  })

  it('shows no-clip on detail before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-clip-detail'))
    expect(screen.getByTestId('no-clip')).toBeInTheDocument()
  })

  it('defaults to light theme and All category', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByTestId('active-category')).toHaveTextContent('All')
  })
})
