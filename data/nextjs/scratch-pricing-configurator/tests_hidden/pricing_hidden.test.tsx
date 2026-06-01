// HELD-OUT generalization tests — overlaid only at eval.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Pricing Configurator (held-out)', () => {
  it('Enterprise monthly no add-ons', () => {
    render(<App />)
    screen.getByRole('radio', { name: /enterprise/i }).click()
    expect(screen.getByText('Total: $99.00 per month')).toBeInTheDocument()
  })

  it('Enterprise annual no add-ons: 99 * 0.9 = 89.10', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: /enterprise/i }))
    await u.click(screen.getByRole('button', { name: /annual/i }))
    expect(screen.getByText('Total: $89.10 per month (10% annual discount applied)')).toBeInTheDocument()
  })

  it('Starter + Advanced Analytics monthly: 9 + 15 = 24', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('checkbox', { name: /advanced analytics/i }))
    expect(screen.getByText('Total: $24.00 per month')).toBeInTheDocument()
  })

  it('Professional + Priority Support annual: (29+10)*0.9 = 35.10', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: /professional/i }))
    await u.click(screen.getByRole('checkbox', { name: /priority support/i }))
    await u.click(screen.getByRole('button', { name: /annual/i }))
    expect(screen.getByText('Total: $35.10 per month (10% annual discount applied)')).toBeInTheDocument()
  })

  it('Enterprise + all add-ons monthly: 99+5+10+15 = 129', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: /enterprise/i }))
    await u.click(screen.getByRole('checkbox', { name: /extra storage/i }))
    await u.click(screen.getByRole('checkbox', { name: /priority support/i }))
    await u.click(screen.getByRole('checkbox', { name: /advanced analytics/i }))
    expect(screen.getByText('Total: $129.00 per month')).toBeInTheDocument()
  })

  it('Enterprise + all add-ons annual: 129 * 0.9 = 116.10', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: /enterprise/i }))
    await u.click(screen.getByRole('checkbox', { name: /extra storage/i }))
    await u.click(screen.getByRole('checkbox', { name: /priority support/i }))
    await u.click(screen.getByRole('checkbox', { name: /advanced analytics/i }))
    await u.click(screen.getByRole('button', { name: /annual/i }))
    expect(screen.getByText('Total: $116.10 per month (10% annual discount applied)')).toBeInTheDocument()
  })

  it('changing plan while annual keeps discount active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /annual/i }))
    await u.click(screen.getByRole('radio', { name: /professional/i }))
    // 29 * 0.9 = 26.10
    expect(screen.getByText('Total: $26.10 per month (10% annual discount applied)')).toBeInTheDocument()
  })

  it('toggling add-on off restores previous total (annual)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /annual/i }))
    await u.click(screen.getByRole('checkbox', { name: /priority support/i }))
    // (9+10)*0.9 = 17.10
    expect(screen.getByText('Total: $17.10 per month (10% annual discount applied)')).toBeInTheDocument()
    await u.click(screen.getByRole('checkbox', { name: /priority support/i }))
    // 9*0.9 = 8.10
    expect(screen.getByText('Total: $8.10 per month (10% annual discount applied)')).toBeInTheDocument()
  })

  it('no discount text appears in monthly mode after add-ons checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('checkbox', { name: /extra storage/i }))
    await u.click(screen.getByRole('checkbox', { name: /advanced analytics/i }))
    expect(screen.queryByText(/annual discount/i)).not.toBeInTheDocument()
    expect(screen.getByText('Total: $29.00 per month')).toBeInTheDocument()
  })
})
