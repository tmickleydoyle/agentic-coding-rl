import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('low stock report', () => {
  it('lists products at or below their reorder point', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-low-stock'))
    expect(screen.getByTestId('low-count')).toHaveTextContent('2 products')
    expect(screen.getByTestId('low-p2')).toBeInTheDocument()
    expect(screen.getByTestId('low-p3')).toBeInTheDocument()
    expect(screen.queryByTestId('low-p1')).not.toBeInTheDocument()
  })

  it('shows how short each low product is', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-low-stock'))
    // p2 qty 5 reorder 8 => short 3
    expect(screen.getByTestId('low-p2-short')).toHaveTextContent('3')
    // p3 qty 0 reorder 4 => short 4
    expect(screen.getByTestId('low-p3-short')).toHaveTextContent('4')
  })

  it('opens a low product detail from the report', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-low-stock'))
    await user.click(screen.getByTestId('low-view-p2'))
    expect(screen.getByTestId('page-product-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Gadget')
  })

  it('toggles theme and persists it across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-low-stock'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-products'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('shows the all-stocked message once nothing is low', async () => {
    const user = userEvent.setup()
    render(<App />)
    // restock p2 above reorder
    await user.click(screen.getByTestId('view-p2'))
    await user.click(screen.getByTestId('go-adjust'))
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '10')
    await user.click(screen.getByTestId('receive')) // p2 -> 15
    // restock p3 above reorder
    await user.click(screen.getByTestId('nav-products'))
    await user.click(screen.getByTestId('view-p3'))
    await user.click(screen.getByTestId('go-adjust'))
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '10')
    await user.click(screen.getByTestId('receive')) // p3 -> 10
    await user.click(screen.getByTestId('nav-low-stock'))
    expect(screen.getByTestId('low-count')).toHaveTextContent('0 products')
    expect(screen.getByTestId('all-stocked')).toBeInTheDocument()
  })
})
