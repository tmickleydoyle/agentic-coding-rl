import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the matrix page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-matrix')).toBeInTheDocument()
    expect(screen.getByTestId('nav-matrix')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-add')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the focus-list page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-focus-list'))
    expect(screen.getByTestId('page-focus-list')).toBeInTheDocument()
    expect(screen.getByTestId('nav-focus-list')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to the matrix', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-matrix'))
    expect(screen.getByTestId('page-matrix')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})
