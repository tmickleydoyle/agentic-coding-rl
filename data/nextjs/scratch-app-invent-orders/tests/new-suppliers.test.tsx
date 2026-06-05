import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('new order and suppliers', () => {
  it('creates a new order and lands on its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('supplier-input'), 'Initech')
    await user.type(screen.getByTestId('item-input'), 'Cables')
    await user.type(screen.getByTestId('ordered-input'), '75')
    await user.click(screen.getByTestId('create-order'))
    expect(screen.getByTestId('page-order-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-supplier')).toHaveTextContent('Initech')
    expect(screen.getByTestId('detail-ordered')).toHaveTextContent('75')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('open')
  })

  it('shows the new order in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('supplier-input'), 'Initech')
    await user.type(screen.getByTestId('item-input'), 'Cables')
    await user.type(screen.getByTestId('ordered-input'), '75')
    await user.click(screen.getByTestId('create-order'))
    await user.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('order-po4')).toBeInTheDocument()
    expect(screen.getByTestId('order-po4-supplier')).toHaveTextContent('Initech')
  })

  it('shows a validation error for a missing supplier', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('item-input'), 'Cables')
    await user.type(screen.getByTestId('ordered-input'), '5')
    await user.click(screen.getByTestId('create-order'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.queryByTestId('page-order-detail')).not.toBeInTheDocument()
  })

  it('shows a validation error for a non-positive ordered quantity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('supplier-input'), 'Initech')
    await user.type(screen.getByTestId('item-input'), 'Cables')
    await user.type(screen.getByTestId('ordered-input'), '0')
    await user.click(screen.getByTestId('create-order'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('aggregates orders per supplier', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-suppliers'))
    expect(screen.getByTestId('supplier-count')).toHaveTextContent('2 suppliers')
    // Acme: 2 orders, outstanding 0 (po1) + 30 (po2) = 30
    expect(screen.getByTestId('supplier-Acme-orders')).toHaveTextContent('2')
    expect(screen.getByTestId('supplier-Acme-outstanding')).toHaveTextContent('30')
    // Globex: 1 order, outstanding 200
    expect(screen.getByTestId('supplier-Globex-orders')).toHaveTextContent('1')
    expect(screen.getByTestId('supplier-Globex-outstanding')).toHaveTextContent('200')
  })

  it('updates supplier aggregates after receiving', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-po3')) // Globex 0/200
    await user.click(screen.getByTestId('receive-all'))
    await user.click(screen.getByTestId('nav-suppliers'))
    expect(screen.getByTestId('supplier-Globex-outstanding')).toHaveTextContent('0')
  })

  it('toggles theme and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-suppliers'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
