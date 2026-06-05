import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the quotes page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-quotes')).toBeInTheDocument()
    expect(screen.getByTestId('nav-quotes')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-new')).not.toHaveAttribute('aria-current')
  })

  it('navigates to new and accepted', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-accepted'))
    expect(screen.getByTestId('page-accepted')).toBeInTheDocument()
    expect(screen.getByTestId('nav-new')).not.toHaveAttribute('aria-current')
  })

  it('reflects light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('shows a no-quote message on detail before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-quote-detail'))
    expect(screen.getByTestId('no-quote')).toBeInTheDocument()
  })
})
