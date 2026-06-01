import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders suppliers by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-suppliers')).toBeInTheDocument()
    expect(screen.getByTestId('nav-suppliers')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-products')).not.toHaveAttribute('aria-current')
  })

  it('navigates to products', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-products'))
    expect(screen.getByTestId('page-products')).toBeInTheDocument()
    expect(screen.getByTestId('nav-products')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to add', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('navigates to supplier-detail and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-supplier-detail'))
    expect(screen.getByTestId('page-supplier-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-suppliers'))
    expect(screen.getByTestId('page-suppliers')).toBeInTheDocument()
    expect(screen.getByTestId('nav-supplier-detail')).not.toHaveAttribute('aria-current')
  })
})
