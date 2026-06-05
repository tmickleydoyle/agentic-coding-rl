// Held-out generalization suite — fresh scenarios, edge cases, and cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addInvestor(u: U, firm: string, checkSize: string, stage: string) {
  await u.clear(screen.getByLabelText('Firm name'))
  await u.type(screen.getByLabelText('Firm name'), firm)
  await u.clear(screen.getByLabelText('Check size ($)'))
  await u.type(screen.getByLabelText('Check size ($)'), checkSize)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.click(screen.getByRole('button', { name: /add investor/i }))
}

describe('Investor CRM (held-out)', () => {
  it('filter by intro shows only intro-stage investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Acme Ventures')).toBeInTheDocument()
    expect(screen.queryByText('Blue Horizon')).not.toBeInTheDocument()
    expect(screen.queryByText('Capital Peak')).not.toBeInTheDocument()
  })

  it('promoting an investor stage updates dashboard committed count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage for Blue Horizon'), 'committed')
    await nav(u, 'Dashboard')
    expect(screen.getByText(/committed: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/total committed: \$350000/i)).toBeInTheDocument()
  })

  it('adding multiple committed investors sums total committed correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Golf Fund', '100000', 'committed')
    await addInvestor(u, 'Hotel Capital', '150000', 'committed')
    await nav(u, 'Dashboard')
    expect(screen.getByText(/total committed: \$500000/i)).toBeInTheDocument()
    expect(screen.getByText(/committed: 3/i)).toBeInTheDocument()
  })

  it('removing a committed investor reduces total committed on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove capital peak/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText(/total committed: \$0/i)).toBeInTheDocument()
    expect(screen.getByText(/committed: 0/i)).toBeInTheDocument()
  })

  it('conversion rounds to nearest whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'India Ventures', '20000', 'committed')
    // now 4 total, 2 committed -> 50%
    await nav(u, 'Dashboard')
    expect(screen.getByText(/total investors: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/conversion: 50%/i)).toBeInTheDocument()
  })

  it('dashboard intro and pitched counts are independent of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    await nav(u, 'Dashboard')
    expect(screen.getByText(/intro: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/pitched: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/total investors: 3/i)).toBeInTheDocument()
  })

  it('changing investor stage from committed to intro updates dashboard totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage for Capital Peak'), 'intro')
    await nav(u, 'Dashboard')
    expect(screen.getByText(/committed: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/intro: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/total committed: \$0/i)).toBeInTheDocument()
  })

  it('filter pitched shows only pitched investors after stage update', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage for Acme Ventures'), 'pitched')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'pitched')
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('Acme Ventures')).toBeInTheDocument()
    expect(screen.getByText('Blue Horizon')).toBeInTheDocument()
  })

  it('theme toggle second time returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('added investor appears in filtered view when stage matches', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    await addInvestor(u, 'Juliet Partners', '80000', 'committed')
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('Juliet Partners')).toBeInTheDocument()
  })

  it('added investor does not appear when stage does not match current filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    await addInvestor(u, 'Kilo Ventures', '60000', 'intro')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Kilo Ventures')).not.toBeInTheDocument()
  })
})
