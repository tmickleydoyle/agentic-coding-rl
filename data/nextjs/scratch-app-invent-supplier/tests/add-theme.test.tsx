import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add supplier flow', () => {
  it('blocks submitting with an empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('lead-input'), '3')
    await user.click(screen.getByTestId('submit-supplier'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks submitting with invalid lead time', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'New Co')
    await user.click(screen.getByTestId('submit-supplier'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a supplier and lands on the list where it appears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'BoltMax')
    await user.type(screen.getByTestId('category-input'), 'Hardware')
    await user.type(screen.getByTestId('lead-input'), '4')
    await user.type(screen.getByTestId('rating-input'), '5')
    await user.click(screen.getByTestId('submit-supplier'))
    expect(screen.getByTestId('page-suppliers')).toBeInTheDocument()
    expect(within(screen.getByTestId('supplier-list')).getByText('BoltMax')).toBeInTheDocument()
    expect(screen.getByTestId('supplier-count')).toHaveTextContent('4')
  })
})

describe('theme', () => {
  it('toggles on the products page and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-products'))
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-suppliers'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
