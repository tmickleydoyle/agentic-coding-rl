import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the properties page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-properties')).toBeInTheDocument()
    expect(screen.getByTestId('nav-properties')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-calculator')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the calculator page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-calculator'))
    expect(screen.getByTestId('page-calculator')).toBeInTheDocument()
    expect(screen.getByTestId('nav-calculator')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the compare page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-compare'))
    expect(screen.getByTestId('page-compare')).toBeInTheDocument()
    expect(screen.getByTestId('nav-compare')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the saved page and back to properties', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-saved'))
    expect(screen.getByTestId('page-saved')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-properties'))
    expect(screen.getByTestId('page-properties')).toBeInTheDocument()
    expect(screen.getByTestId('nav-saved')).not.toHaveAttribute('aria-current')
  })
})
