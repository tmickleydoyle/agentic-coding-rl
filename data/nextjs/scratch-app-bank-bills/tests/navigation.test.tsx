import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the bills page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-bills')).toBeInTheDocument()
    expect(screen.getByTestId('nav-bills')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-upcoming')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the upcoming page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-upcoming'))
    expect(screen.getByTestId('page-upcoming')).toBeInTheDocument()
  })

  it('navigates to bill-detail (empty when nothing selected) and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-bill-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-bills'))
    expect(screen.getByTestId('page-bills')).toBeInTheDocument()
    expect(screen.getByTestId('nav-bill-detail')).not.toHaveAttribute('aria-current')
  })
})
