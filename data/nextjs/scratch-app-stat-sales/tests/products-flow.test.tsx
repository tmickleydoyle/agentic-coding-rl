import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('products flow', () => {
  it('lists products with revenue summed across regions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-products'))
    // Widget: 1000+500+700 = 2200, units 22
    expect(screen.getByTestId('product-Widget-revenue')).toHaveTextContent('2200')
    expect(screen.getByTestId('product-Widget-units')).toHaveTextContent('22')
    // Gadget: 2000, Gizmo: 300
    expect(screen.getByTestId('product-Gadget-revenue')).toHaveTextContent('2000')
    expect(screen.getByTestId('product-Gizmo-revenue')).toHaveTextContent('300')
  })

  it('orders the product list by revenue descending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-products'))
    const list = screen.getByTestId('product-list')
    const items = within(list).getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('data-testid', 'product-Widget')
    expect(items[1]).toHaveAttribute('data-testid', 'product-Gadget')
    expect(items[2]).toHaveAttribute('data-testid', 'product-Gizmo')
  })

  it('shows no detail before selecting a product', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-products'))
    expect(screen.queryByTestId('product-detail')).not.toBeInTheDocument()
  })

  it('selecting a product shows its detail revenue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-products'))
    await user.click(screen.getByTestId('select-Gadget'))
    expect(screen.getByTestId('product-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Gadget')
    expect(screen.getByTestId('detail-revenue')).toHaveTextContent('2000')
  })

  it('reflects the region filter in the product list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('region-filter'), 'APAC')
    await user.click(screen.getByTestId('nav-products'))
    // APAC: o4 Gadget 1200, o6 Widget 700
    expect(screen.getByTestId('product-Gadget-revenue')).toHaveTextContent('1200')
    expect(screen.getByTestId('product-Widget-revenue')).toHaveTextContent('700')
    expect(screen.queryByTestId('product-Gizmo')).not.toBeInTheDocument()
  })
})
