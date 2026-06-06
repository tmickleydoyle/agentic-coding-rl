import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Net Worth Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders 3 seed assets', () => {
    expect(screen.getAllByTestId('asset-row')).toHaveLength(3)
  })

  it('renders 2 seed liabilities', () => {
    expect(screen.getAllByTestId('liability-row')).toHaveLength(2)
  })

  it('shows correct total assets', () => {
    // 5000+20000+45000 = 70000
    expect(screen.getByTestId('total-assets').textContent).toContain('$70000.00')
  })

  it('shows correct total liabilities', () => {
    // 8000+25000 = 33000
    expect(screen.getByTestId('total-liabilities').textContent).toContain('$33000.00')
  })

  it('shows correct net worth', () => {
    // 70000-33000 = 37000
    expect(screen.getByTestId('net-worth').textContent).toContain('$37000.00')
  })

  it('shows Positive Net Worth status', () => {
    expect(screen.getByTestId('net-worth-status').textContent).toBe('Positive Net Worth')
  })

  it('adds a new asset', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/asset name/i), 'Home')
    await user.type(screen.getByLabelText(/asset value/i), '200000')
    await user.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getAllByTestId('asset-row')).toHaveLength(4)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('clears asset form after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/asset name/i), 'Home')
    await user.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getByLabelText(/asset name/i)).toHaveValue('')
  })

  it('adds a new liability', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/liability name/i), 'Mortgage')
    await user.type(screen.getByLabelText(/liability value/i), '150000')
    await user.click(screen.getByRole('button', { name: /add liability/i }))
    expect(screen.getAllByTestId('liability-row')).toHaveLength(3)
  })

  it('deletes an asset and recalculates', async () => {
    const user = userEvent.setup()
    // Delete Checking Account (5000)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('asset-row')).toHaveLength(2)
    // 70000-5000=65000
    expect(screen.getByTestId('total-assets').textContent).toContain('$65000.00')
  })

  it('shows Negative Net Worth when liabilities exceed assets', async () => {
    const user = userEvent.setup()
    // Add a large liability
    await user.type(screen.getByLabelText(/liability name/i), 'Debt')
    await user.type(screen.getByLabelText(/liability value/i), '100000')
    await user.click(screen.getByRole('button', { name: /add liability/i }))
    expect(screen.getByTestId('net-worth-status').textContent).toBe('Negative Net Worth')
  })

  it('shows $0.00 net worth and Positive status when all cleared', async () => {
    const user = userEvent.setup()
    // Delete all assets (3) and liabilities (2)
    for (let i = 0; i < 5; i++) {
      await user.click(screen.getAllByRole('button', { name: /delete/i })[0])
    }
    expect(screen.getByTestId('net-worth').textContent).toContain('$0.00')
    expect(screen.getByTestId('net-worth-status').textContent).toBe('Positive Net Worth')
  })
})
