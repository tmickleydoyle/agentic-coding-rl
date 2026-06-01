import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the week page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-week')).toBeInTheDocument()
    expect(screen.getByTestId('nav-week')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-grocery')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the recipes page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-recipes'))
    expect(screen.getByTestId('page-recipes')).toBeInTheDocument()
    expect(screen.getByTestId('nav-recipes')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the grocery page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-grocery'))
    expect(screen.getByTestId('page-grocery')).toBeInTheDocument()
  })

  it('navigates to day-detail and back to week', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-day-detail'))
    expect(screen.getByTestId('page-day-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-week'))
    expect(screen.getByTestId('page-week')).toBeInTheDocument()
    expect(screen.getByTestId('nav-day-detail')).not.toHaveAttribute('aria-current')
  })

  it('reflects the default theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
