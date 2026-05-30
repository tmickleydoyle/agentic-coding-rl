import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the portfolio page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-portfolio')).toBeInTheDocument()
    expect(screen.getByTestId('nav-portfolio')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-add')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the detail page (no holding selected)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-holding-detail'))
    expect(screen.getByTestId('page-holding-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-holding-selected')).toBeInTheDocument()
  })

  it('navigates to allocation and back to portfolio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-allocation'))
    expect(screen.getByTestId('page-allocation')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-portfolio'))
    expect(screen.getByTestId('page-portfolio')).toBeInTheDocument()
    expect(screen.getByTestId('nav-allocation')).not.toHaveAttribute('aria-current')
  })
})
