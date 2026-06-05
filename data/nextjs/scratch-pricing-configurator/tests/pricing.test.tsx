import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Pricing Configurator', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /pricing configurator/i })).toBeInTheDocument()
  })

  it('shows Monthly and Annual buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /monthly/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /annual/i })).toBeInTheDocument()
  })

  it('Monthly is active by default (aria-pressed true)', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /monthly/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /annual/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows all three base plan radio options', () => {
    render(<App />)
    const section = screen.getByRole('region', { name: /base plan/i })
    expect(within(section).getByRole('radio', { name: /starter/i })).toBeInTheDocument()
    expect(within(section).getByRole('radio', { name: /professional/i })).toBeInTheDocument()
    expect(within(section).getByRole('radio', { name: /enterprise/i })).toBeInTheDocument()
  })

  it('Starter is selected by default', () => {
    render(<App />)
    expect(screen.getByRole('radio', { name: /starter/i })).toBeChecked()
    expect(screen.getByRole('radio', { name: /professional/i })).not.toBeChecked()
  })

  it('shows all three add-on checkboxes unchecked by default', () => {
    render(<App />)
    const section = screen.getByRole('region', { name: /add-ons/i })
    expect(within(section).getByRole('checkbox', { name: /extra storage/i })).not.toBeChecked()
    expect(within(section).getByRole('checkbox', { name: /priority support/i })).not.toBeChecked()
    expect(within(section).getByRole('checkbox', { name: /advanced analytics/i })).not.toBeChecked()
  })

  it('shows correct default total for Starter monthly', () => {
    render(<App />)
    expect(screen.getByText('Total: $9.00 per month')).toBeInTheDocument()
  })

  it('updates total when switching to Professional', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: /professional/i }))
    expect(screen.getByText('Total: $29.00 per month')).toBeInTheDocument()
  })

  it('updates total when switching to Enterprise', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: /enterprise/i }))
    expect(screen.getByText('Total: $99.00 per month')).toBeInTheDocument()
  })

  it('adds Extra Storage price to total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('checkbox', { name: /extra storage/i }))
    expect(screen.getByText('Total: $14.00 per month')).toBeInTheDocument()
  })

  it('adds multiple add-ons to total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('checkbox', { name: /extra storage/i }))
    await u.click(screen.getByRole('checkbox', { name: /priority support/i }))
    expect(screen.getByText('Total: $24.00 per month')).toBeInTheDocument()
  })

  it('removes add-on price when unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('checkbox', { name: /extra storage/i }))
    await u.click(screen.getByRole('checkbox', { name: /extra storage/i }))
    expect(screen.getByText('Total: $9.00 per month')).toBeInTheDocument()
  })

  it('applies annual discount and shows discount message', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /annual/i }))
    expect(screen.getByText('Total: $8.10 per month (10% annual discount applied)')).toBeInTheDocument()
  })

  it('annual discount with add-on: Starter + Extra Storage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('checkbox', { name: /extra storage/i }))
    await u.click(screen.getByRole('button', { name: /annual/i }))
    expect(screen.getByText('Total: $12.60 per month (10% annual discount applied)')).toBeInTheDocument()
  })

  it('switching back to monthly removes discount message', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /annual/i }))
    await u.click(screen.getByRole('button', { name: /monthly/i }))
    expect(screen.getByText('Total: $9.00 per month')).toBeInTheDocument()
    expect(screen.queryByText(/annual discount/i)).not.toBeInTheDocument()
  })

  it('annual button has aria-pressed true after clicking it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /annual/i }))
    expect(screen.getByRole('button', { name: /annual/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /monthly/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('Professional + all add-ons annual total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: /professional/i }))
    await u.click(screen.getByRole('checkbox', { name: /extra storage/i }))
    await u.click(screen.getByRole('checkbox', { name: /priority support/i }))
    await u.click(screen.getByRole('checkbox', { name: /advanced analytics/i }))
    await u.click(screen.getByRole('button', { name: /annual/i }))
    // 29 + 5 + 10 + 15 = 59, * 0.9 = 53.10
    expect(screen.getByText('Total: $53.10 per month (10% annual discount applied)')).toBeInTheDocument()
  })
})
